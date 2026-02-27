import { useState, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

const SIZES = [16, 32, 48, 64, 128, 256];

async function canvasToPngBytes(canvas: HTMLCanvasElement): Promise<Uint8Array> {
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Failed to encode PNG');
  return new Uint8Array(await blob.arrayBuffer());
}

async function createIcoFromCanvas(canvas: HTMLCanvasElement, sizes: number[]): Promise<Blob> {
  const w = canvas.width;
  const h = canvas.height;

  const images: { bytes: Uint8Array; size: number }[] = [];
  for (const size of sizes) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const cctx = c.getContext('2d')!;
    cctx.drawImage(canvas, 0, 0, w, h, 0, 0, size, size);
    const bytes = await canvasToPngBytes(c);
    images.push({ bytes, size });
  }

  const headerSize = 6;
  const dirSize = 16 * images.length;
  const imageStart = headerSize + dirSize;
  const totalImageBytes = images.reduce((sum, img) => sum + img.bytes.byteLength, 0);
  const result = new Uint8Array(imageStart + totalImageBytes);
  const view = new DataView(result.buffer);

  // ICONDIR
  view.setUint16(0, 0, true);
  view.setUint16(2, 1, true);
  view.setUint16(4, images.length, true);

  // ICONDIRENTRY + image bytes
  let imageOffset = imageStart;
  let writePos = imageStart;
  for (let i = 0; i < images.length; i++) {
    const { size, bytes } = images[i];
    const entryOffset = headerSize + i * 16;

    view.setUint8(entryOffset + 0, size === 256 ? 0 : size);
    view.setUint8(entryOffset + 1, size === 256 ? 0 : size);
    view.setUint8(entryOffset + 2, 0); // color count
    view.setUint8(entryOffset + 3, 0); // reserved
    view.setUint16(entryOffset + 4, 1, true); // planes
    view.setUint16(entryOffset + 6, 32, true); // bpp
    view.setUint32(entryOffset + 8, bytes.byteLength, true); // image size
    view.setUint32(entryOffset + 12, imageOffset, true); // image offset

    result.set(bytes, writePos);
    imageOffset += bytes.byteLength;
    writePos += bytes.byteLength;
  }

  return new Blob([result], { type: 'image/x-icon' });
}

export function PngToIco() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [sizes, setSizes] = useState<number[]>([16, 32, 48]);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setOutput(null);
    setError('');
  };

  const toggleSize = (s: number) => {
    setSizes((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s].sort((a, b) => a - b)));
  };

  const convert = () => {
    if (!file) return;
    setError('');
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      try {
        createIcoFromCanvas(canvas, sizes.length ? sizes : [32])
          .then((blob) => setOutput(blob))
          .catch((e) => setError((e as Error).message || 'Conversion failed'));
      } catch (e) {
        setError((e as Error).message || 'Conversion failed');
      } finally {
        URL.revokeObjectURL(img.src);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      setError('Failed to load image');
    };
    img.src = URL.createObjectURL(file);
  };

  const download = () => {
    if (!output || !file) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(output);
    a.download = file.name.replace(/\.[^.]+$/, '') + '.ico';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  };

  return (
    <ToolLayout
      title="PNG to ICO"
      description="Convert PNG to ICO favicon. Purpose: Website favicons, app icons, or Windows icons."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="png-ico"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">Upload a PNG image to create an ICO file with multiple sizes.</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/png"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)]"
        >
          {file ? file.name : 'Select PNG'}
        </button>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Include sizes (px)</label>
          <div className="flex flex-wrap gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => toggleSize(s)}
                className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm ${
                  sizes.includes(s) ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border)]'
                }`}
              >
                {s}×{s}
              </button>
            ))}
          </div>
        </div>
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        <button
          type="button"
          onClick={convert}
          disabled={!file}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          Convert to ICO
        </button>
        {output && (
          <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <button type="button" onClick={download} className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium">
              Download ICO
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
