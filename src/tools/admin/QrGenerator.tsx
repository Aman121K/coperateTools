import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';
import { readTextFromClipboard } from '../../utils/clipboard';

const SIZE_PRESETS = [200, 256, 500, 512, 1000, 1024];
type QrFormat = 'png' | 'jpg' | 'webp' | 'svg';
const PREVIEW_SIZE = 320;

function sanitizeFileName(name: string): string {
  const trimmed = name.trim();
  const safe = trimmed.replace(/[<>:"/\\|?*\x00-\x1F]/g, '').replace(/\s+/g, '-');
  return safe || 'qrcode';
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Failed to load logo image'));
    img.src = src;
  });
}

async function createQrCanvas(text: string, size: number): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  await QRCode.toCanvas(canvas, text, {
    width: size,
    margin: 2,
    color: { dark: '#000000', light: '#FFFFFF' },
  });
  return canvas;
}

async function drawCenterLogo(canvas: HTMLCanvasElement, logoDataUrl: string, logoScale: number): Promise<void> {
  if (!logoDataUrl) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const logo = await loadImage(logoDataUrl);
  const logoSize = Math.max(24, Math.round(canvas.width * logoScale));
  const x = (canvas.width - logoSize) / 2;
  const y = (canvas.height - logoSize) / 2;
  const padding = Math.max(4, Math.round(logoSize * 0.12));
  const radius = Math.max(6, Math.round(logoSize * 0.18));

  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.moveTo(x - padding + radius, y - padding);
  ctx.lineTo(x + logoSize + padding - radius, y - padding);
  ctx.quadraticCurveTo(x + logoSize + padding, y - padding, x + logoSize + padding, y - padding + radius);
  ctx.lineTo(x + logoSize + padding, y + logoSize + padding - radius);
  ctx.quadraticCurveTo(x + logoSize + padding, y + logoSize + padding, x + logoSize + padding - radius, y + logoSize + padding);
  ctx.lineTo(x - padding + radius, y + logoSize + padding);
  ctx.quadraticCurveTo(x - padding, y + logoSize + padding, x - padding, y + logoSize + padding - radius);
  ctx.lineTo(x - padding, y - padding + radius);
  ctx.quadraticCurveTo(x - padding, y - padding, x - padding + radius, y - padding);
  ctx.closePath();
  ctx.fill();

  ctx.drawImage(logo, x, y, logoSize, logoSize);
}

export function QrGenerator() {
  const [text, setText] = useState('https://example.com');
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [size, setSize] = useState(500);
  const [customSize, setCustomSize] = useState('500');
  const [format, setFormat] = useState<QrFormat>('png');
  const [fileName, setFileName] = useState('qrcode');
  const [logoDataUrl, setLogoDataUrl] = useState('');
  const [logoScale, setLogoScale] = useState(0.2);

  useEffect(() => {
    let cancelled = false;
    setError('');
    if (!text.trim()) {
      setUrl('');
      return;
    }
    (async () => {
      try {
        const canvas = await createQrCanvas(text, PREVIEW_SIZE);
        if (logoDataUrl) {
          await drawCenterLogo(canvas, logoDataUrl, logoScale);
        }
        if (!cancelled) setUrl(canvas.toDataURL('image/png'));
      } catch (err: unknown) {
        if (!cancelled) setError((err as Error).message);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [text, logoDataUrl, logoScale]);

  const download = async () => {
    if (!text.trim()) return;

    const normalizedSize = Math.max(100, Math.min(size, 4000));
    let href = '';
    let extension: string = format;
    let revokeAfter = false;

    if (format === 'svg') {
      let svg = await QRCode.toString(text, {
        type: 'svg',
        width: normalizedSize,
        margin: 2,
        color: { dark: '#000000', light: '#FFFFFF' },
      });
      if (logoDataUrl) {
        const logoSize = Math.max(24, Math.round(normalizedSize * logoScale));
        const x = Math.round((normalizedSize - logoSize) / 2);
        const y = Math.round((normalizedSize - logoSize) / 2);
        const padding = Math.max(4, Math.round(logoSize * 0.12));
        const radius = Math.max(6, Math.round(logoSize * 0.18));
        const logoLayer = `<rect x="${x - padding}" y="${y - padding}" width="${logoSize + padding * 2}" height="${logoSize + padding * 2}" rx="${radius}" ry="${radius}" fill="#ffffff"/><image href="${logoDataUrl}" x="${x}" y="${y}" width="${logoSize}" height="${logoSize}" preserveAspectRatio="xMidYMid meet"/>`;
        svg = svg.replace('</svg>', `${logoLayer}</svg>`);
      }
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
      const canvas = await createQrCanvas(text, normalizedSize);
      if (logoDataUrl) {
        await drawCenterLogo(canvas, logoDataUrl, logoScale);
      }
      href = canvas.toDataURL(mime, format === 'png' ? undefined : 0.92);
      extension = format === 'jpg' ? 'jpeg' : format;
    }

    const a = document.createElement('a');
    a.href = href;
    a.download = `${sanitizeFileName(fileName)}-${normalizedSize}x${normalizedSize}.${extension}`;
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

  const handleLogoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file for the logo.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setLogoDataUrl(String(reader.result || ''));
      setError('');
    };
    reader.onerror = () => setError('Unable to read selected logo file.');
    reader.readAsDataURL(file);
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
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
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
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">File name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="qrcode"
              className="w-full px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
            />
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
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Center logo or image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoFile}
              className="w-full px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
            />
            {logoDataUrl && (
              <button
                type="button"
                onClick={() => setLogoDataUrl('')}
                className="mt-2 px-3 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-secondary)]"
              >
                Remove Logo
              </button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Logo size ({Math.round(logoScale * 100)}%)</label>
            <input
              type="range"
              min={10}
              max={35}
              value={Math.round(logoScale * 100)}
              onChange={(e) => setLogoScale(Number(e.target.value) / 100)}
              className="w-full"
            />
            <p className="mt-2 text-xs text-[var(--text-muted)]">Recommended: 15% to 25% for better scan reliability.</p>
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
        {error && <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>}
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
