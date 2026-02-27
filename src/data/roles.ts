import type { Department } from '../types';

export type RoleId = string;

export interface Role {
  id: RoleId;
  name: string;
  department: Department;
  icon: string;
}

export const DEPARTMENTS_WITH_ROLES: Record<Department, Role[]> = {
  finance: [
    { id: 'accountant', name: 'Accountant', department: 'finance', icon: '📒' },
    { id: 'analyst', name: 'Financial Analyst', department: 'finance', icon: '📊' },
    { id: 'cfo', name: 'CFO / Finance Lead', department: 'finance', icon: '👔' },
    { id: 'bookkeeper', name: 'Bookkeeper', department: 'finance', icon: '📗' },
  ],
  admin: [
    { id: 'office-manager', name: 'Office Manager', department: 'admin', icon: '🏢' },
    { id: 'exec-assistant', name: 'Executive Assistant', department: 'admin', icon: '📋' },
    { id: 'admin', name: 'Administrator', department: 'admin', icon: '⚙' },
  ],
  hr: [
    { id: 'recruiter', name: 'Recruiter', department: 'hr', icon: '👥' },
    { id: 'hr-admin', name: 'HR Admin', department: 'hr', icon: '📁' },
    { id: 'hr-manager', name: 'HR Manager', department: 'hr', icon: '👤' },
    { id: 'hrbp', name: 'HR Business Partner', department: 'hr', icon: '🤝' },
  ],
  legal: [
    { id: 'paralegal', name: 'Paralegal', department: 'legal', icon: '⚖' },
    { id: 'legal-counsel', name: 'Legal Counsel', department: 'legal', icon: '📜' },
    { id: 'compliance', name: 'Compliance Officer', department: 'legal', icon: '✅' },
  ],
  marketing: [
    { id: 'content-marketer', name: 'Content Marketer', department: 'marketing', icon: '✍' },
    { id: 'seo-specialist', name: 'SEO Specialist', department: 'marketing', icon: '🔍' },
    { id: 'social-media', name: 'Social Media Manager', department: 'marketing', icon: '📱' },
    { id: 'marketing-manager', name: 'Marketing Manager', department: 'marketing', icon: '📣' },
  ],
  sales: [
    { id: 'sales-rep', name: 'Sales Representative', department: 'sales', icon: '💼' },
    { id: 'account-manager', name: 'Account Manager', department: 'sales', icon: '🤝' },
    { id: 'sales-manager', name: 'Sales Manager', department: 'sales', icon: '📈' },
  ],
  support: [
    { id: 'support-agent', name: 'Support Agent', department: 'support', icon: '🎧' },
    { id: 'support-lead', name: 'Support Lead', department: 'support', icon: '👨‍💼' },
    { id: 'customer-success', name: 'Customer Success', department: 'support', icon: '⭐' },
  ],
  operations: [
    { id: 'ops-coordinator', name: 'Operations Coordinator', department: 'operations', icon: '📦' },
    { id: 'logistics', name: 'Logistics Manager', department: 'operations', icon: '🚚' },
    { id: 'ops-manager', name: 'Operations Manager', department: 'operations', icon: '⚙' },
  ],
  procurement: [
    { id: 'buyer', name: 'Buyer', department: 'procurement', icon: '🛒' },
    { id: 'procurement-manager', name: 'Procurement Manager', department: 'procurement', icon: '📋' },
    { id: 'sourcing', name: 'Sourcing Specialist', department: 'procurement', icon: '🔎' },
  ],
  qa: [
    { id: 'qa-engineer', name: 'QA Engineer', department: 'qa', icon: '🧪' },
    { id: 'test-lead', name: 'Test Lead', department: 'qa', icon: '✅' },
    { id: 'qa-analyst', name: 'QA Analyst', department: 'qa', icon: '📊' },
  ],
  student: [
    { id: 'student', name: 'Student', department: 'student', icon: '🎓' },
    { id: 'researcher', name: 'Researcher', department: 'student', icon: '🔬' },
    { id: 'teacher', name: 'Teacher / Educator', department: 'student', icon: '👩‍🏫' },
  ],
  developer: [
    { id: 'frontend', name: 'Frontend Developer', department: 'developer', icon: '💻' },
    { id: 'backend', name: 'Backend Developer', department: 'developer', icon: '⚙' },
    { id: 'fullstack', name: 'Full-Stack Developer', department: 'developer', icon: '🔄' },
    { id: 'devops', name: 'DevOps Engineer', department: 'developer', icon: '🔧' },
  ],
  freelancer: [
    { id: 'freelancer', name: 'Freelancer', department: 'freelancer', icon: '💼' },
    { id: 'gig-worker', name: 'Gig Worker', department: 'freelancer', icon: '🚗' },
    { id: 'contractor', name: 'Contractor', department: 'freelancer', icon: '📋' },
  ],
  slips: [
    { id: 'property-manager', name: 'Property Manager', department: 'slips', icon: '🏠' },
    { id: 'account-assistant', name: 'Accounts Assistant', department: 'slips', icon: '🧾' },
    { id: 'daily-ops', name: 'Daily Operations', department: 'slips', icon: '📒' },
  ],
  general: [
    { id: 'general', name: 'General User (all tools)', department: 'general', icon: '👤' },
  ],
};

export const ALL_ROLES = Object.values(DEPARTMENTS_WITH_ROLES).flat();

export function getRolesForDepartment(dept: Department): Role[] {
  return DEPARTMENTS_WITH_ROLES[dept] ?? [];
}
