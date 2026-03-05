import type { Tool } from '../types';
import type { UserProfile } from '../types';

/**
 * Returns tools available to the user based on selected department/role.
 * - `general` role/department gets all tools.
 * - Other roles get tools from their own department.
 * - If a tool defines `roles`, it is restricted to those role IDs.
 */
export function getToolsForProfile(tools: Tool[], profile: UserProfile | null): Tool[] {
  if (!profile) return tools;

  const isGeneralProfile = profile.department === 'general' || profile.roleId === 'general';
  if (isGeneralProfile) return tools;

  const departmentTools = tools.filter(
    (tool) => tool.department === profile.department || tool.department === 'general'
  );
  const roleScopedTools = departmentTools.filter((tool) => {
    if (!tool.roles || tool.roles.length === 0) return true;
    return tool.roles.includes(profile.roleId);
  });

  return roleScopedTools;
}
