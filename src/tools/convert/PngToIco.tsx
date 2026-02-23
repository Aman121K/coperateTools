import { useState, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

const SIZES = [16, 32, 48, 64, 128, 256];

function createIcoFromCanvas(canvas: HTMLCanvasElement, sizes: number[]): Blob {
  const w = canvas.width;
  const h = canvas.height;

  const images: { data: Uint8Array; size: number }[] = [];
  for (const size of sizes) {
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const cctx = c.getContext('2d')!;
    cctx.drawImage(canvas, 0, 0, w, h, 0, 0, size, size);
    const imgData = cctx.getImageData(0, 0, size, size);
    images.push({ data: new Uint8Array(imgData.data), size });
  }

  const headerSize = 6 + 16 * images.length;
  let offset = headerSize;
  const header = new ArrayBuffer(headerSize);
  const headerView = new DataView(header);
  headerView.setUint16(0, 0, true);
  headerView.setUint16(2, 1, true);
  headerView.setUint16(4, images.length, true);

  const parts: ArrayBuffer[] = [header];
  for (let i = 0; i < images.length; i++) {
    const { size } = images[i];
    const bmpHeaderSize = 40;
    const rowSize = Math.floor((size * 4 + 3) / 4) * 4;
    const pixelDataSize = rowSize * size;
    const imageSize = bmpHeaderSize + pixelDataSize;

    const dirEntry = new ArrayBuffer(16);
    const de = new DataView(dirEntry);
    de.setUint8(0, size);
    de.setUint8(1, size);
    de.setUint16(2, 0, true);
    de.setUint16(4, 0, true);
    de.setUint16(6, 1, true);
    de.setUint16(8, 32, true);
    de.setUint32(10, imageSize, true);
    de.setUint32(14, offset, true);
    parts.push(dirEntry);
    offset += imageSize;
  }

  for (const { data: imgData, size } of images) {
    const rowSize = Math.floor((size * 4 + 3) / 4) * 4;
    const bmpHeader = new ArrayBuffer(40);
    const bv = new DataView(bmpHeader);
    bv.setUint32(0, 40, true);
    bv.setInt32(4, size, true);
    bv.setInt32(8, -size, true);
    bv.setUint16(12, 1, true);
    bv.setUint16(14, 32, true);

    const padded = new Uint8Array(rowSize * size);
    for (let y = size - 1; y >= 0; y--) {
      const src = y * size * 4;
      const dst = (size - 1 - y) * rowSize;
      for (let x = 0; x < size * 4; x++) padded[dst + x] = imgData[src + x];
    }
    parts.push(bmpHeader);
    parts.push(padded.buffer);
  }

  const total = parts.reduce((a, p) => a + p.byteLength, 0);
  const result = new Uint8Array(total);
  let pos = 0;
  for (const p of parts) {
    result.set(new Uint8Array(p), pos);
    pos += p.byteLength;
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
        const blob = createIcoFromCanvas(canvas, sizes.length ? sizes : [32]);
        setOutput(blob);
      } catch (e) {
        setError((e as Error).message || 'Conversion failed');
      }
    };
    img.onerror = () => setError('Failed to load image');
    img.src = URL.createObjectURL(file);
  };

  const download = () => {
    if (!output || !file) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(output);
    a.download = file.name.replace(/\.[^.]+$/, '') + '.ico';
    a.click();
    URL.revokeObjectURL(a.href);
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
