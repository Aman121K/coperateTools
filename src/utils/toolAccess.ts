import type { Tool } from '../types';
import type { UserProfile } from '../types';

export function getToolsForProfile(tools: Tool[], profile: UserProfile | null): Tool[] {
  if (!profile) return tools;
  const { department, roleId } = profile;
  if (department === 'general') return tools;
  return tools.filter((t) => {
    if (t.department !== department) return false;
    if (!t.roles || t.roles.length === 0) return true;
    return t.roles.includes(roleId);
  });
}
