export type Department = 'finance' | 'admin' | 'hr' | 'developer' | 'legal' | 'marketing' | 'sales' | 'support' | 'operations' | 'procurement' | 'qa' | 'student' | 'freelancer' | 'general';

export interface Tool {
  id: string;
  name: string;
  department: Department;
  category: string;
  path: string;
  icon: string;
  description?: string;
  /** Role IDs that can access. Empty = all roles in department. */
  roles?: string[];
}

export interface UserProfile {
  department: Department;
  roleId: string;
}

export interface HistoryItem {
  id: string;
  toolId: string;
  input: string;
  output?: string;
  timestamp: number;
}
