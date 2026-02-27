function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, text.length);
  const success = document.execCommand('copy');
  document.body.removeChild(textarea);
  return success;
}

export async function writeTextToClipboard(text: string): Promise<boolean> {
  if (!text) return true;
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall back to legacy copy for restricted clipboard environments.
  }
  return fallbackCopy(text);
}

export async function readTextFromClipboard(): Promise<string> {
  if (!navigator.clipboard?.readText) {
    throw new Error('Clipboard read is not supported in this browser.');
  }
  return navigator.clipboard.readText();
}
