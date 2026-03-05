import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';

export function PdfMerge() {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files ?? []).filter((f) => f.type === 'application/pdf');
    setFiles(selected);
    setError('');
    setStatus('');
  };

  const merge = async () => {
    if (files.length < 2) {
      setError('Select at least 2 PDFs');
      return;
    }
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const merged = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus(`Merging file ${i + 1}/${files.length}...`);
        const bytes = await file.arrayBuffer();
        const doc = await PDFDocument.load(bytes);
        const pages = await merged.copyPages(doc, doc.getPageIndices());
        pages.forEach((p) => merged.addPage(p));
      }
      const pdfBytes = await merged.save();
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'merged.pdf';
      a.click();
      URL.revokeObjectURL(a.href);
      setStatus('Merged PDF is ready and download started.');
    } catch (e) {
      setError((e as Error).message);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const move = (i: number, dir: number) => {
    const j = i + dir;
    if (j < 0 || j >= files.length) return;
    const next = [...files];
    [next[i], next[j]] = [next[j], next[i]];
    setFiles(next);
  };

  const removeAt = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <ToolLayout title="PDF Merger" description="Merge multiple PDFs into one. Purpose: Combine reports, contracts, or documents into a single file for sharing or submission." input="" output="" onInputChange={() => {}} toolId="pdf-merge" singlePanel showCopyMinified={false} shareData={{ fileCount: files.length }}>
      <div className="max-w-lg space-y-4">
        <input
          type="file"
          accept="application/pdf"
          multiple
          onChange={handleFiles}
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--accent)] file:text-white"
        />
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        {status && <p className="text-sm text-[var(--text-secondary)]">{status}</p>}
        {files.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--text-muted)]">
                {files.length} PDF(s) selected. Reorder using arrows.
              </p>
              <button
                type="button"
                onClick={() => {
                  setFiles([]);
                  setStatus('');
                  setError('');
                }}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
            <ul className="space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center gap-2 p-2 rounded bg-[var(--bg-tertiary)] border border-[var(--border)]">
                  <button type="button" onClick={() => move(i, -1)} disabled={i === 0} className="px-2 disabled:opacity-50">↑</button>
                  <button type="button" onClick={() => move(i, 1)} disabled={i === files.length - 1} className="px-2 disabled:opacity-50">↓</button>
                  <span className="flex-1 truncate text-sm">{f.name}</span>
                  <button
                    type="button"
                    onClick={() => removeAt(i)}
                    className="px-2 text-xs text-[var(--text-secondary)] hover:text-[var(--error)]"
                    aria-label={`Remove ${f.name}`}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={merge}
              disabled={loading || files.length < 2}
              className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-50"
            >
              {loading ? 'Merging...' : 'Merge & Download'}
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
