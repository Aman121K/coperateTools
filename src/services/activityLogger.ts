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

const MAX_TEXT_LEN = 1200;
const FILE_LIKE_PATTERNS = [/^data:image\//i, /^data:application\/pdf/i, /^blob:/i];

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
  const itemRef = push(ref(db, activitiesNode(uid)));
  await set(itemRef, {
    ...safe,
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
