import { push, ref, set, type Database } from 'firebase/database';
import type { Department } from '../types';

const LOCAL_SUGGESTIONS_KEY = 'devtool_tool_suggestions';
const MAX_TEXT_LEN = 1500;

export type SuggestionType = 'existing_tool_feedback' | 'new_tool_request';

export interface ToolSuggestionInput {
  type: SuggestionType;
  title: string;
  details: string;
  existingToolId?: string | null;
  existingToolRating?: number | null;
  requestedToolName?: string | null;
  requestedToolDepartment?: Department | 'general' | null;
  contactEmail?: string | null;
  roleId?: string | null;
  profileDepartment?: Department | 'general' | null;
  userId?: string | null;
  userName?: string | null;
}

function sanitizeText(value: unknown, maxLen = MAX_TEXT_LEN): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > maxLen ? `${trimmed.slice(0, maxLen)}…` : trimmed;
}

function normalizePayload(payload: ToolSuggestionInput) {
  const rating =
    typeof payload.existingToolRating === 'number' &&
    Number.isFinite(payload.existingToolRating) &&
    payload.existingToolRating >= 1 &&
    payload.existingToolRating <= 5
      ? payload.existingToolRating
      : null;

  return {
    type: payload.type,
    title: sanitizeText(payload.title, 180) ?? 'Untitled feedback',
    details: sanitizeText(payload.details) ?? '',
    existingToolId: sanitizeText(payload.existingToolId, 80),
    existingToolRating: rating,
    requestedToolName: sanitizeText(payload.requestedToolName, 120),
    requestedToolDepartment: payload.requestedToolDepartment ?? null,
    contactEmail: sanitizeText(payload.contactEmail, 180),
    roleId: sanitizeText(payload.roleId, 80),
    profileDepartment: payload.profileDepartment ?? null,
    userId: sanitizeText(payload.userId, 120),
    userName: sanitizeText(payload.userName, 180),
    createdAt: Date.now(),
  };
}

function saveSuggestionLocally(data: ReturnType<typeof normalizePayload>) {
  if (typeof window === 'undefined') return;
  const currentRaw = localStorage.getItem(LOCAL_SUGGESTIONS_KEY);
  const current = currentRaw ? (JSON.parse(currentRaw) as Array<Record<string, unknown>>) : [];
  current.unshift(data);
  localStorage.setItem(LOCAL_SUGGESTIONS_KEY, JSON.stringify(current.slice(0, 300)));
}

export async function submitToolSuggestion(db: Database | null, payload: ToolSuggestionInput) {
  const data = normalizePayload(payload);

  if (db) {
    const itemRef = push(ref(db, 'toolSuggestions'));
    await set(itemRef, data);
    return { storage: 'cloud' as const };
  }

  saveSuggestionLocally(data);
  return { storage: 'local' as const };
}

