import { useState, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

export function ReplaceBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setResult(null);
    setError('');
  };

  const process = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (blob) setResult(blob);
      }, 'image/png');
    } catch (e) {
      setError((e as Error).message || 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(result);
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'image') + '-new-bg.png';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout
      title="Replace Background"
      description="Add a solid color background to images with transparency. Purpose: Product shots, thumbnails, or design mockups."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="replace-bg"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload an image with transparency (e.g. from Remove Background). Adds a solid color behind it.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)]"
        >
          {file ? file.name : 'Select image (PNG with transparency)'}
        </button>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Background color</label>
          <div className="flex gap-2 items-center">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="w-12 h-10 rounded border border-[var(--border)] cursor-pointer bg-transparent"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-sm"
            />
          </div>
        </div>
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        <button
          type="button"
          onClick={process}
          disabled={!file || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? 'Processing...' : 'Replace Background'}
        </button>
        {result && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Result</p>
              <img
                src={URL.createObjectURL(result)}
                alt="Result"
                className="max-h-48 rounded-[var(--radius-sm)] border border-[var(--border)]"
              />
            </div>
            <button
              type="button"
              onClick={download}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
            >
              Download PNG
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
