import type { Tool } from '../types';
import type { UserProfile } from '../types';

/**
 * Returns tools available to the user. All users can access all tools regardless of role.
 * Role selection is a preference for personalization, not a restriction.
 */
export function getToolsForProfile(tools: Tool[], _profile: UserProfile | null): Tool[] {
  return tools;
}
