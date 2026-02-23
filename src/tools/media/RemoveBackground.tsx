import { useState, useRef } from 'react';
import { removeBackground } from '@imgly/background-removal';
import { ToolLayout } from '../../components/ToolLayout';

const MAX_MB = 20;

export function RemoveBackground() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setResult(null);
    setError('');
  };

  const remove = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setProgress('Loading model...');
    try {
      const blob = await removeBackground(file, {
        progress: (key: string, current: number, total: number) => {
          if (total > 0) setProgress(`Downloading ${key}: ${Math.round((current / total) * 100)}%`);
          else setProgress('Processing...');
        },
        output: { format: 'image/png' as const },
      });
      setResult(blob);
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('SharedArrayBuffer') || msg.includes('cross-origin')) {
        setError('Needs secure context. Run via npm run dev or serve with COOP/COEP headers.');
      } else {
        setError(msg || 'Background removal failed');
      }
    } finally {
      setLoading(false);
      setProgress('');
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(result);
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'image') + '-no-bg.png';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout
      title="Remove Background"
      description="Remove image background and make it transparent. Purpose: Product photos, portraits, logos, or design assets. Runs in browser — no upload to external servers."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="remove-bg"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload an image. AI removes the background and outputs PNG with transparency. Max {MAX_MB}MB. First run downloads ~80MB model (cached after).
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
          {file ? file.name : 'Select image'}
        </button>
        {file && file.size > MAX_MB * 1024 * 1024 && (
          <p className="text-sm text-[var(--error)]">File too large. Max {MAX_MB}MB.</p>
        )}
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        <button
          type="button"
          onClick={remove}
          disabled={!file || loading || (file?.size ?? 0) > MAX_MB * 1024 * 1024}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? progress || 'Processing...' : 'Remove Background'}
        </button>
        {result && file && (
          <div className="space-y-4">
            <div className="flex gap-4 items-start">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-muted)] mb-1">Original</p>
                <img src={URL.createObjectURL(file)} alt="Original" className="max-h-40 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-[var(--text-muted)] mb-1">Transparent</p>
                <img src={URL.createObjectURL(result)} alt="Result" className="max-h-40 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[repeating-conic-gradient(#80808020_0%_25%,transparent_0%_50%)_50%/20px_20px]" />
              </div>
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
