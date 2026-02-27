import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';
import { readTextFromClipboard } from '../../utils/clipboard';

const SIZE_PRESETS = [200, 256, 500, 512, 1000, 1024];
type QrFormat = 'png' | 'jpg' | 'webp' | 'svg';

export function QrGenerator() {
  const [text, setText] = useState('https://example.com');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState(500);
  const [customSize, setCustomSize] = useState('500');
  const [format, setFormat] = useState<QrFormat>('png');

  useEffect(() => {
    setError('');
    if (!text.trim()) {
      setUrl('');
      return;
    }
    QRCode.toDataURL(text, { width: 320, margin: 2 })
      .then(setUrl)
      .catch((err: unknown) => setError((err as Error).message));
  }, [text]);

  const download = async () => {
    if (!text.trim()) return;

    const normalizedSize = Math.max(100, Math.min(size, 4000));
    let href = '';
    let extension: string = format;
    let revokeAfter = false;

    if (format === 'svg') {
      const svg = await QRCode.toString(text, { type: 'svg', width: normalizedSize, margin: 2 });
      const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
      href = URL.createObjectURL(blob);
      revokeAfter = true;
    } else {
      const mime =
        format === 'jpg'
          ? 'image/jpeg'
          : format === 'webp'
            ? 'image/webp'
            : 'image/png';
      href = await QRCode.toDataURL(text, {
        width: normalizedSize,
        margin: 2,
        type: mime,
        color: { dark: '#000000', light: '#FFFFFF' },
        rendererOpts: { quality: format === 'png' ? undefined : 0.92 },
      });
      extension = format === 'jpg' ? 'jpeg' : format;
    }

    const a = document.createElement('a');
    a.href = href;
    a.download = `qrcode-${normalizedSize}x${normalizedSize}.${extension}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    if (revokeAfter) URL.revokeObjectURL(href);
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
    <ToolLayout title="QR Code Generator" description="Generate QR codes for URLs, text, WiFi. Export as PNG, JPG, WEBP, or SVG in standard sizes." input={text} output={url} onInputChange={setText} toolId="qr-generator" singlePanel showCopyMinified={false} showDownload={false}>
      <div className="max-w-xl space-y-4">
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as QrFormat)}
              className="w-full px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
            >
              <option value="png">PNG (recommended)</option>
              <option value="jpg">JPG</option>
              <option value="webp">WEBP</option>
              <option value="svg">SVG (vector)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Custom size (px)</label>
            <input
              type="number"
              min={100}
              max={4000}
              value={customSize}
              onChange={(e) => setCustomSize(e.target.value)}
              onBlur={() => {
                const n = Number(customSize);
                if (!Number.isFinite(n)) return;
                const next = Math.max(100, Math.min(Math.round(n), 4000));
                setSize(next);
                setCustomSize(String(next));
              }}
              className="w-full px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Industry standard sizes</label>
          <div className="flex flex-wrap gap-2">
            {SIZE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSize(preset);
                  setCustomSize(String(preset));
                }}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm border ${
                  size === preset
                    ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                    : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)]'
                }`}
              >
                {preset} x {preset}
              </button>
            ))}
          </div>
        </div>
        {url && (
          <div className="flex flex-col items-center gap-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <img src={url} alt="QR Code" className="rounded-lg" />
            <button type="button" onClick={download} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">
              Download {format.toUpperCase()} ({size} x {size})
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
