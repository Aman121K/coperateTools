/**
 * SEO / Site config. Update SITE_URL when deploying to production.
 */
export const SITE_URL = import.meta.env.VITE_APP_URL || 'https://coperate-tools.vercel.app';
export const SITE_NAME = 'Corporate Tools';
export const SITE_DESCRIPTION =
  'Free online tools for everyone: PDF to JPG, remove image background, currency converter, BMI calculator, tip calculator, JSON formatter, QR code generator, and 80+ more. No signup required for demo.';
export const SITE_KEYWORDS = [
  'free online tools',
  'PDF to JPG converter',
  'remove background from image',
  'image background remover',
  'currency converter',
  'BMI calculator',
  'tip calculator',
  'split bill calculator',
  'JSON formatter',
  'QR code generator',
  'barcode generator',
  'PDF merger',
  'PDF splitter',
  'unit converter',
  'age calculator',
  'compound interest calculator',
  'GPA calculator',
  'working days calculator',
  'password generator',
  'base64 encode decode',
  'JWT decoder',
  'image to PDF',
  'PNG to ICO',
  'MP4 to MP3',
  'MKV to MP4',
  'make image transparent',
  'replace image background',
  'corporate tools',
  'productivity tools',
  'developer tools',
  'finance calculator',
  'document converter',
  'file converter',
].join(', ');
