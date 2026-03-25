import {
  onValue,
  orderByChild,
  push,
  query,
  ref,
  set,
  update,
  limitToLast,
  type Database,
} from 'firebase/database';
import type { UserProfile } from '../types';

type Primitive = string | number | boolean | null | undefined;

export interface ActivityEvent {
  action: string;
  toolId?: string;
  input?: string;
  output?: string;
  [key: string]: Primitive;
}

interface VisitorGeo {
  ipAddress: string | null;
  country: string | null;
  countryCode: string | null;
  region: string | null;
  city: string | null;
  timezone: string | null;
  locationName: string | null;
  geoProvider: string | null;
}

const MAX_TEXT_LEN = 1200;
const FILE_LIKE_PATTERNS = [/^data:image\//i, /^data:application\/pdf/i, /^blob:/i];
const GEO_CACHE_KEY = 'devtool_geo_v1';
const GEO_LOGGING_ENABLED = import.meta.env.VITE_ENABLE_GEO_LOGGING !== 'false';
let geoPromise: Promise<VisitorGeo> | null = null;

function sanitizeText(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (FILE_LIKE_PATTERNS.some((rx) => rx.test(trimmed))) return null;
  return trimmed.length > MAX_TEXT_LEN ? `${trimmed.slice(0, MAX_TEXT_LEN)}…` : trimmed;
}

function sanitizeEvent(event: ActivityEvent): Record<string, Primitive> {
  const safe: Record<string, Primitive> = {
    action: event.action,
    toolId: event.toolId ?? null,
  };
  for (const [key, value] of Object.entries(event)) {
    if (key === 'action' || key === 'toolId') continue;
    if (key === 'input' || key === 'output') {
      safe[key] = sanitizeText(value);
      continue;
    }
    if (typeof value === 'string') {
      safe[key] = sanitizeText(value);
    } else if (typeof value === 'number' || typeof value === 'boolean' || value == null) {
      safe[key] = value;
    }
  }
  return safe;
}

function normalizeGeo(payload: unknown, provider: string): VisitorGeo | null {
  if (!payload || typeof payload !== 'object') return null;
  const row = payload as Record<string, unknown>;
  const ip = row.ip;
  const country = row.country_name ?? row.country;
  const countryCode = row.country_code ?? row.country_code2;
  const region = row.region ?? row.region_name ?? null;
  const city = row.city ?? null;
  const timezone = row.timezone ?? row.time_zone ?? null;

  const safeCountry = typeof country === 'string' ? sanitizeText(country) : null;
  const safeRegion = typeof region === 'string' ? sanitizeText(region) : null;
  const safeCity = typeof city === 'string' ? sanitizeText(city) : null;
  const locationName = [safeCity, safeRegion, safeCountry].filter(Boolean).join(', ') || null;

  return {
    ipAddress: typeof ip === 'string' ? sanitizeText(ip) : null,
    country: safeCountry,
    countryCode: typeof countryCode === 'string' ? sanitizeText(countryCode)?.toUpperCase() ?? null : null,
    region: safeRegion,
    city: safeCity,
    timezone: typeof timezone === 'string' ? sanitizeText(timezone) : null,
    locationName,
    geoProvider: provider,
  };
}

async function fetchJson(url: string, timeoutMs = 3500): Promise<unknown> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchVisitorGeo(): Promise<VisitorGeo> {
  if (!GEO_LOGGING_ENABLED || typeof window === 'undefined') {
    return {
      ipAddress: null,
      country: null,
      countryCode: null,
      region: null,
      city: null,
      timezone: null,
      locationName: null,
      geoProvider: null,
    };
  }

  try {
    const cached = sessionStorage.getItem(GEO_CACHE_KEY);
    if (cached) return JSON.parse(cached) as VisitorGeo;
  } catch {
    // ignore bad cache and refetch
  }

  const urls = [
    { url: import.meta.env.VITE_GEO_ENDPOINT || 'https://ipapi.co/json/', provider: 'ipapi.co' },
    { url: 'https://ipwho.is/', provider: 'ipwho.is' },
  ];

  for (const candidate of urls) {
    const data = await fetchJson(candidate.url);
    const normalized = normalizeGeo(data, candidate.provider);
    if (normalized) {
      try {
        sessionStorage.setItem(GEO_CACHE_KEY, JSON.stringify(normalized));
      } catch {
        // best-effort cache
      }
      return normalized;
    }
  }

  return {
    ipAddress: null,
    country: null,
    countryCode: null,
    region: null,
    city: null,
    timezone: null,
    locationName: null,
    geoProvider: null,
  };
}

async function getVisitorGeo(): Promise<VisitorGeo> {
  if (!geoPromise) {
    geoPromise = fetchVisitorGeo();
  }
  return geoPromise;
}

function userNode(uid: string) {
  return `users/${uid}`;
}

function activitiesNode(uid: string) {
  return `${userNode(uid)}/activities`;
}

export async function upsertUserProfile(
  db: Database | null,
  uid: string,
  user: { email: string | null; displayName: string | null; photoURL: string | null },
  profile?: UserProfile | null
) {
  if (!db || !uid || uid === 'demo-user') return;
  await update(ref(db, userNode(uid)), {
    uid,
    email: user.email ?? null,
    displayName: user.displayName ?? null,
    photoURL: user.photoURL ?? null,
    department: profile?.department ?? null,
    roleId: profile?.roleId ?? null,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  });
}

export async function logUserActivity(db: Database | null, uid: string, event: ActivityEvent) {
  if (!db || !uid || uid === 'demo-user') return;
  const safe = sanitizeEvent(event);
  const geo = await getVisitorGeo();
  const itemRef = push(ref(db, activitiesNode(uid)));
  await set(itemRef, {
    ...safe,
    ...geo,
    createdAt: Date.now(),
  });
}

export function subscribeUserActivities(
  db: Database | null,
  uid: string,
  onData: (items: Array<Record<string, unknown>>) => void,
  onError?: (err: Error) => void
) {
  if (!db || !uid || uid === 'demo-user') {
    onData([]);
    return () => {};
  }
  const q = query(ref(db, activitiesNode(uid)), orderByChild('createdAt'), limitToLast(200));
  return onValue(
    q,
    (snap) => {
      const value = snap.val() as Record<string, Record<string, unknown>> | null;
      if (!value) {
        onData([]);
        return;
      }
      const rows = Object.entries(value)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => {
          const aTime = Number((a as Record<string, unknown>).createdAt ?? 0);
          const bTime = Number((b as Record<string, unknown>).createdAt ?? 0);
          return bTime - aTime;
        });
      onData(rows);
    },
    (e) => onError?.(e as Error)
  );
}
