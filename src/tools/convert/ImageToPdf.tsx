import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';

export function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [output, setOutput] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) {
      setFiles([]);
      setOutput(null);
      setStatus('');
      return;
    }
    const arr = Array.from(list).filter((f) => f.type === 'image/jpeg' || f.type === 'image/png');
    setError(arr.length !== list.length ? 'Only JPG and PNG files are supported.' : '');
    setFiles(arr);
    setOutput(null);
    setStatus('');
  };

  const convert = async () => {
    if (!files.length) return;
    setLoading(true);
    setError('');
    setStatus('');
    try {
      const doc = await PDFDocument.create();
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setStatus(`Processing image ${i + 1}/${files.length}...`);
        const bytes = await file.arrayBuffer();
        const img = file.type === 'image/png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await doc.save();
      setOutput(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
      setStatus('PDF generated successfully.');
    } catch (e) {
      setError((e as Error).message || 'Conversion failed');
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!output) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(output);
    a.download = 'images.pdf';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const clearSelection = () => {
    setFiles([]);
    setOutput(null);
    setError('');
    setStatus('');
  };

  return (
    <ToolLayout
      title="JPG / PNG to PDF"
      description="Convert images to a single PDF. Purpose: Combine screenshots, photos, or scans into one document."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="image-pdf"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload one or more JPG/PNG images. They will be combined into a single PDF in order.
        </p>
        <input
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          multiple
          onChange={handleFiles}
          className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--accent)] file:text-white file:cursor-pointer"
        />
        {files.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs text-[var(--text-muted)]">{files.length} image(s) selected in upload order</p>
              <button
                type="button"
                onClick={clearSelection}
                className="text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline underline-offset-2"
              >
                Clear
              </button>
            </div>
            <ul className="max-h-32 overflow-auto rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2 space-y-1">
              {files.map((f, i) => (
                <li key={`${f.name}-${i}`} className="text-xs text-[var(--text-secondary)] truncate">
                  {i + 1}. {f.name}
                </li>
              ))}
            </ul>
          </div>
        )}
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        {status && <p className="text-sm text-[var(--text-secondary)]">{status}</p>}
        <button
          type="button"
          onClick={convert}
          disabled={!files.length || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? 'Converting…' : 'Convert to PDF'}
        </button>
        {output && (
          <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <p className="text-sm text-[var(--text-muted)] mb-2">PDF ready</p>
            <button
              type="button"
              onClick={download}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
            >
              Download PDF
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
