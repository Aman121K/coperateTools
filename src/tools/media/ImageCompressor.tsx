import { useState, useRef, useCallback } from 'react';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import { ToolLayout } from '../../components/ToolLayout';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';

const FORMAT_OPTIONS: { value: OutputFormat; label: string }[] = [
  { value: 'image/jpeg', label: 'JPG' },
  { value: 'image/png', label: 'PNG' },
  { value: 'image/webp', label: 'WebP' },
];

export function ImageCompressor() {
  const [files, setFiles] = useState<File[]>([]);
  const [compressed, setCompressed] = useState<{ file: File; original: File }[]>([]);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<OutputFormat>('image/jpeg');
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []);
    const valid = selected.filter((f) =>
      ['image/png', 'image/jpeg', 'image/webp'].includes(f.type)
    );
    setFiles(valid);
    setCompressed([]);
  };

  const compress = async () => {
    if (files.length === 0) return;
    setLoading(true);
    setCompressed([]);
    try {
      const results = await Promise.all(
        files.map(async (file) => {
          const opts = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            fileType: format,
            initialQuality: quality / 100,
          };
          const compressedFile = await imageCompression(file, opts);
          return { file: compressedFile, original: file };
        })
      );
      setCompressed(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getExt = () => (format === 'image/jpeg' ? 'jpg' : format === 'image/png' ? 'png' : 'webp');

  const downloadOne = (file: File) => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(file);
    const base = file.name.replace(/\.[^.]+$/, '') || 'image';
    a.download = `${base}-compressed.${getExt()}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const downloadAllZip = async () => {
    const zip = new JSZip();
    compressed.forEach(({ file }) => zip.file(file.name, file));
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'compressed-images.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const totalOriginal = files.reduce((a, f) => a + f.size, 0);
  const totalCompressed = compressed.reduce((a, { file }) => a + file.size, 0);
  const saved = totalOriginal > 0 ? Math.round((1 - totalCompressed / totalOriginal) * 100) : 0;

  const handleRestoreFromShare = useCallback((data: Record<string, unknown>) => {
    if (typeof data.quality === 'number') setQuality(data.quality);
    if (typeof data.format === 'string') setFormat(data.format as OutputFormat);
  }, []);

  return (
    <ToolLayout
      title="Image Compressor"
      description="Compress PNG/JPG/WebP with quality control. Purpose: Reduce image size for web or email without losing clarity."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="image-compressor"
      singlePanel
      showCopyMinified={false}
      shareData={{ quality, format }}
      onRestoreFromShare={handleRestoreFromShare}
    >
      <div className="space-y-6">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Images (PNG, JPG, WebP)</label>
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              multiple
              onChange={handleUpload}
              className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--accent)] file:text-white file:cursor-pointer"
            />
          </div>
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Quality: {quality}%</label>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value, 10))}
                className="w-32"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Output format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as OutputFormat)}
                className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
              >
                {FORMAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>
            <div className="self-end">
              <button
                type="button"
                onClick={compress}
                disabled={files.length === 0 || loading}
                className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Compressing...' : 'Compress'}
              </button>
            </div>
          </div>
        </div>

        {files.length > 0 && !compressed.length && !loading && (
          <p className="text-sm text-[var(--text-secondary)]">
            {files.length} file(s) selected. Click Compress to start.
          </p>
        )}

        {compressed.length > 0 && (
          <>
            <div className="flex items-center justify-between p-3 rounded-[var(--radius)] bg-[var(--success)]/10 border border-[var(--success)]/30">
              <span className="text-sm font-medium text-[var(--success)]">
                Saved ~{saved}% • {formatBytes(totalOriginal)} → {formatBytes(totalCompressed)}
              </span>
              <button
                type="button"
                onClick={downloadAllZip}
                className="px-3 py-1.5 text-sm rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                Download ZIP
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {compressed.map(({ file, original }, i) => (
                <div key={i} className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden bg-[var(--bg-tertiary)]">
                  <div className="aspect-square flex items-center justify-center p-2 bg-[var(--bg-secondary)]">
                    <img src={URL.createObjectURL(file)} alt="" className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="p-2 text-xs text-[var(--text-secondary)]">
                    <div>{file.name}</div>
                    <div>{formatBytes(original.size)} → {formatBytes(file.size)}</div>
                    <button
                      type="button"
                      onClick={() => downloadOne(file)}
                      className="mt-1 text-[var(--accent)] hover:underline"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}

function formatBytes(n: number) {
  if (n < 1024) return n + ' B';
  if (n < 1024 * 1024) return (n / 1024).toFixed(1) + ' KB';
  return (n / (1024 * 1024)).toFixed(1) + ' MB';
}
