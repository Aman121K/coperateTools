import type { Tool } from '../types';

export const TOOLS: Tool[] = [
  // ═══════════════════════════════════════════════════════════
  // FINANCE DEPARTMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'currency-converter', name: 'Currency Converter', department: 'finance', category: 'calculators', path: '/tools/finance/currency', icon: '💱' },
  { id: 'tax-calculator', name: 'Tax Calculator', department: 'finance', category: 'calculators', path: '/tools/finance/tax', icon: '📊' },
  { id: 'emi-calculator', name: 'EMI / Loan Calculator', department: 'finance', category: 'calculators', path: '/tools/finance/emi', icon: '🏦' },
  { id: 'number-to-words', name: 'Number to Words', department: 'finance', category: 'converters', path: '/tools/finance/number-words', icon: '🔢' },
  { id: 'percentage-calc', name: 'Percentage Calculator', department: 'finance', category: 'calculators', path: '/tools/finance/percentage', icon: '%' },
  { id: 'invoice-generator', name: 'Invoice Generator', department: 'finance', category: 'documents', path: '/tools/finance/invoice', icon: '📄' },
  // ═══════════════════════════════════════════════════════════
  // ADMIN DEPARTMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'qr-generator', name: 'QR Code Generator', department: 'admin', category: 'generators', path: '/tools/admin/qr', icon: '📱' },
  { id: 'barcode-generator', name: 'Barcode Generator', department: 'admin', category: 'generators', path: '/tools/admin/barcode', icon: '📊' },
  { id: 'pdf-merge', name: 'PDF Merger', department: 'admin', category: 'documents', path: '/tools/admin/pdf-merge', icon: '📑' },
  { id: 'pdf-split', name: 'PDF Splitter', department: 'admin', category: 'documents', path: '/tools/admin/pdf-split', icon: '✂' },
  { id: 'unit-converter', name: 'Unit Converter', department: 'admin', category: 'converters', path: '/tools/admin/unit-converter', icon: '📏' },
  { id: 'date-calculator', name: 'Date Calculator', department: 'admin', category: 'calculators', path: '/tools/admin/date-calc', icon: '📅' },
  // ═══════════════════════════════════════════════════════════
  // HR DEPARTMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'leave-calculator', name: 'Leave Calculator', department: 'hr', category: 'calculators', path: '/tools/hr/leave', icon: '🏖' },
  { id: 'salary-slip', name: 'Salary Slip Generator', department: 'hr', category: 'documents', path: '/tools/hr/salary-slip', icon: '💰' },
  { id: 'employee-id', name: 'Employee ID Generator', department: 'hr', category: 'generators', path: '/tools/hr/employee-id', icon: '🪪' },
  { id: 'attendance-calc', name: 'Attendance Calculator', department: 'hr', category: 'calculators', path: '/tools/hr/attendance', icon: '⏱' },
  { id: 'org-chart', name: 'Org Chart Generator', department: 'hr', category: 'documents', path: '/tools/hr/org-chart', icon: '🏢' },
  // ═══════════════════════════════════════════════════════════
  // LEGAL DEPARTMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'word-counter', name: 'Word Counter', department: 'legal', category: 'tools', path: '/tools/legal/word-counter', icon: '📝' },
  { id: 'case-number', name: 'Case Number Generator', department: 'legal', category: 'generators', path: '/tools/legal/case-number', icon: '⚖' },
  { id: 'document-id', name: 'Document ID Generator', department: 'legal', category: 'generators', path: '/tools/legal/document-id', icon: '📋' },
  // ═══════════════════════════════════════════════════════════
  // MARKETING DEPARTMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'meta-tags', name: 'Meta Tags Generator', department: 'marketing', category: 'seo', path: '/tools/marketing/meta-tags', icon: '🏷' },
  { id: 'character-counter', name: 'Character Counter', department: 'marketing', category: 'tools', path: '/tools/marketing/character-counter', icon: '🔤' },
  { id: 'social-preview', name: 'Social Media Preview', department: 'marketing', category: 'preview', path: '/tools/marketing/social-preview', icon: '📱' },
  // ═══════════════════════════════════════════════════════════
  // SALES DEPARTMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'commission-calc', name: 'Commission Calculator', department: 'sales', category: 'calculators', path: '/tools/sales/commission', icon: '💵' },
  { id: 'discount-calc', name: 'Discount Calculator', department: 'sales', category: 'calculators', path: '/tools/sales/discount', icon: '🏷' },
  { id: 'quote-generator', name: 'Quote Generator', department: 'sales', category: 'documents', path: '/tools/sales/quote', icon: '📑' },
  // ═══════════════════════════════════════════════════════════
  // CUSTOMER SUPPORT
  // ═══════════════════════════════════════════════════════════
  { id: 'ticket-id', name: 'Ticket ID Generator', department: 'support', category: 'generators', path: '/tools/support/ticket-id', icon: '🎫' },
  { id: 'faq-generator', name: 'FAQ Generator', department: 'support', category: 'documents', path: '/tools/support/faq', icon: '❓' },
  { id: 'response-template', name: 'Response Template', department: 'support', category: 'templates', path: '/tools/support/response-template', icon: '💬' },
  // ═══════════════════════════════════════════════════════════
  // OPERATIONS
  // ═══════════════════════════════════════════════════════════
  { id: 'inventory-calc', name: 'Inventory Calculator', department: 'operations', category: 'calculators', path: '/tools/operations/inventory', icon: '📦' },
  { id: 'capacity-calc', name: 'Capacity Calculator', department: 'operations', category: 'calculators', path: '/tools/operations/capacity', icon: '📊' },
  { id: 'shipping-calc', name: 'Shipping Cost Estimator', department: 'operations', category: 'calculators', path: '/tools/operations/shipping', icon: '🚚' },
  // ═══════════════════════════════════════════════════════════
  // PROCUREMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'po-generator', name: 'Purchase Order Generator', department: 'procurement', category: 'documents', path: '/tools/procurement/po', icon: '📄' },
  { id: 'vendor-comparison', name: 'Vendor Comparison', department: 'procurement', category: 'tools', path: '/tools/procurement/vendor-comparison', icon: '⚖' },
  // ═══════════════════════════════════════════════════════════
  // QUALITY ASSURANCE
  // ═══════════════════════════════════════════════════════════
  { id: 'bug-report', name: 'Bug Report Template', department: 'qa', category: 'templates', path: '/tools/qa/bug-report', icon: '🐛' },
  { id: 'test-case', name: 'Test Case Generator', department: 'qa', category: 'templates', path: '/tools/qa/test-case', icon: '✅' },
  { id: 'release-notes', name: 'Release Notes Generator', department: 'qa', category: 'documents', path: '/tools/qa/release-notes', icon: '📋' },
  // ═══════════════════════════════════════════════════════════
  // STUDENT
  // ═══════════════════════════════════════════════════════════
  { id: 'citation-generator', name: 'Citation Generator', department: 'student', category: 'research', path: '/tools/student/citation', icon: '📚' },
  { id: 'word-counter-student', name: 'Essay Word Counter', department: 'student', category: 'tools', path: '/tools/student/word-counter', icon: '📝' },
  { id: 'pomodoro-timer', name: 'Pomodoro Timer', department: 'student', category: 'tools', path: '/tools/student/pomodoro', icon: '🍅' },
  { id: 'flashcard-generator', name: 'Flashcard Generator', department: 'student', category: 'study', path: '/tools/student/flashcards', icon: '🃏' },
  { id: 'reading-time', name: 'Reading Time Calculator', department: 'student', category: 'tools', path: '/tools/student/reading-time', icon: '⏱' },
  { id: 'study-planner', name: 'Study Session Planner', department: 'student', category: 'study', path: '/tools/student/study-planner', icon: '📅' },
  { id: 'note-outline', name: 'Note Outline Generator', department: 'student', category: 'study', path: '/tools/student/note-outline', icon: '📋' },
  // ═══════════════════════════════════════════════════════════
  // DEVELOPER DEPARTMENT
  // ═══════════════════════════════════════════════════════════
  { id: 'json-formatter', name: 'JSON Formatter', department: 'developer', category: 'formatters', path: '/tools/json/formatter', icon: '{}' },
  { id: 'json-validator', name: 'JSON Validator', department: 'developer', category: 'formatters', path: '/tools/json/validator', icon: '✓' },
  { id: 'json-minifier', name: 'JSON Minifier', department: 'developer', category: 'formatters', path: '/tools/json/minifier', icon: '⌫' },
  { id: 'json-yaml', name: 'JSON ↔ YAML', department: 'developer', category: 'converters', path: '/tools/json/yaml', icon: '⇄' },
  { id: 'json-xml', name: 'JSON ↔ XML', department: 'developer', category: 'converters', path: '/tools/json/xml', icon: '⇄' },
  { id: 'csv-json', name: 'CSV ↔ JSON', department: 'developer', category: 'converters', path: '/tools/csv/json', icon: '⇄' },
  { id: 'base64', name: 'Base64 Encode/Decode', department: 'developer', category: 'converters', path: '/tools/encode/base64', icon: '64' },
  { id: 'url-encode', name: 'URL Encode/Decode', department: 'developer', category: 'converters', path: '/tools/encode/url', icon: '%' },
  { id: 'jwt', name: 'JWT Decoder', department: 'developer', category: 'debugging', path: '/tools/debug/jwt', icon: '🔐' },
  { id: 'hash', name: 'Hash Generator', department: 'developer', category: 'debugging', path: '/tools/debug/hash', icon: '#' },
  { id: 'uuid', name: 'UUID / NanoID', department: 'developer', category: 'debugging', path: '/tools/debug/uuid', icon: '🆔' },
  { id: 'regex', name: 'Regex Tester', department: 'developer', category: 'debugging', path: '/tools/debug/regex', icon: '.*' },
  { id: 'diff', name: 'Text Diff', department: 'developer', category: 'debugging', path: '/tools/compare/diff', icon: '≠' },
  { id: 'cron', name: 'Cron Builder', department: 'developer', category: 'debugging', path: '/tools/debug/cron', icon: '⏰' },
  { id: 'timestamp', name: 'Timestamp Converter', department: 'developer', category: 'debugging', path: '/tools/debug/timestamp', icon: '🕐' },
  { id: 'case-converter', name: 'Case Converter', department: 'developer', category: 'converters', path: '/tools/debug/case-converter', icon: 'Aa' },
  { id: 'password-generator', name: 'Password Generator', department: 'developer', category: 'debugging', path: '/tools/debug/password', icon: '🔑' },
  { id: 'color-converter', name: 'Color Converter', department: 'developer', category: 'converters', path: '/tools/debug/color', icon: '🎨' },
  { id: 'lorem-ipsum', name: 'Lorem Ipsum', department: 'developer', category: 'generators', path: '/tools/debug/lorem', icon: '📝' },
  { id: 'curl', name: 'cURL → Fetch/Axios', department: 'developer', category: 'api', path: '/tools/api/curl', icon: '→' },
  { id: 'faker', name: 'Dummy Data', department: 'developer', category: 'data', path: '/tools/data/faker', icon: '👤' },
  { id: 'dummy-images', name: 'Dummy Images', department: 'developer', category: 'data', path: '/tools/data/images', icon: '🖼' },
  { id: 'dummy-videos', name: 'Dummy Videos', department: 'developer', category: 'data', path: '/tools/data/videos', icon: '🎬' },
  { id: 'image-compressor', name: 'Image Compressor', department: 'developer', category: 'media', path: '/tools/media/compressor', icon: '🗜' },
  { id: 'image-resizer', name: 'Image Resizer', department: 'developer', category: 'media', path: '/tools/media/resizer', icon: '📐' },
  { id: 'pdf-images', name: 'PDF → Images', department: 'developer', category: 'media', path: '/tools/media/pdf-images', icon: '📄' },
  { id: 'mp4-mp3', name: 'MP4 → MP3', department: 'developer', category: 'media', path: '/tools/media/mp4-mp3', icon: '🎵' },
  { id: 'mp3-mp4', name: 'MP3 → MP4', department: 'developer', category: 'media', path: '/tools/media/mp3-mp4', icon: '🎬' },
  { id: 'json-flatten', name: 'JSON Flatten/Unflatten', department: 'developer', category: 'formatters', path: '/tools/json/flatten', icon: '↔' },
  { id: 'json-types', name: 'JSON → TypeScript', department: 'developer', category: 'formatters', path: '/tools/json/types', icon: 'TS' },
  { id: 'json-csv', name: 'JSON → CSV', department: 'developer', category: 'converters', path: '/tools/json/csv', icon: '⇄' },
];

export const DEPARTMENTS = {
  finance: 'Finance',
  admin: 'Admin',
  hr: 'HR',
  legal: 'Legal',
  marketing: 'Marketing',
  sales: 'Sales',
  support: 'Customer Support',
  operations: 'Operations',
  procurement: 'Procurement',
  qa: 'Quality Assurance',
  student: 'Student',
  developer: 'Developer',
  general: 'General',
} as const;

export const CATEGORIES: Record<string, string> = {
  calculators: 'Calculators',
  converters: 'Converters',
  documents: 'Documents',
  generators: 'Generators',
  formatters: 'Formatters',
  debugging: 'Debugging',
  api: 'API',
  data: 'Data',
  media: 'Media',
};
