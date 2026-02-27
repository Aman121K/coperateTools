import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';
import { readTextFromClipboard } from '../../utils/clipboard';

export function QrGenerator() {
  const [text, setText] = useState('https://example.com');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (!text.trim()) {
      setUrl('');
      return;
    }
    QRCode.toDataURL(text, { width: 256, margin: 2 })
      .then(setUrl)
      .catch((err: unknown) => setError((err as Error).message));
  }, [text]);

  const download = () => {
    if (!url) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const pasteFromClipboard = async () => {
    try {
      const clipboardText = await readTextFromClipboard();
      if (!clipboardText) {
        setError('Clipboard is empty.');
        return;
      }
      setText(clipboardText);
      setError('');
    } catch {
      setError('Unable to read clipboard. Please paste with keyboard.');
    }
  };

  return (
    <ToolLayout title="QR Code Generator" description="Generate QR codes for URLs, text, WiFi. Purpose: Share links, contact info, or WiFi credentials easily via mobile scan." input={text} output={url} onInputChange={setText} toolId="qr-generator" singlePanel showCopyMinified={false}>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Text or URL</label>
          <Editor value={text} onChange={setText} language="plaintext" height="80px" />
          <div className="mt-3">
            <button
              type="button"
              onClick={pasteFromClipboard}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] hover:bg-[var(--border)] border border-[var(--border)] text-[var(--text-primary)]"
            >
              Paste from Clipboard
            </button>
          </div>
          {error && <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>}
        </div>
        {url && (
          <div className="flex flex-col items-center gap-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <img src={url} alt="QR Code" className="rounded-lg" />
            <button type="button" onClick={download} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Download PNG</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
