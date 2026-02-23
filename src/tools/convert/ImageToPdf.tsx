import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';

export function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([]);
  const [output, setOutput] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const list = e.target.files;
    if (!list?.length) {
      setFiles([]);
      setOutput(null);
      return;
    }
    const arr = Array.from(list).filter((f) => f.type.startsWith('image/'));
    setFiles(arr);
    setOutput(null);
    setError('');
  };

  const convert = async () => {
    if (!files.length) return;
    setLoading(true);
    setError('');
    try {
      const doc = await PDFDocument.create();
      for (const file of files) {
        const bytes = await file.arrayBuffer();
        const img = file.type === 'image/png' ? await doc.embedPng(bytes) : await doc.embedJpg(bytes);
        const page = doc.addPage([img.width, img.height]);
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height });
      }
      const pdfBytes = await doc.save();
      setOutput(new Blob([pdfBytes as BlobPart], { type: 'application/pdf' }));
    } catch (e) {
      setError((e as Error).message || 'Conversion failed');
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
          <p className="text-xs text-[var(--text-muted)]">{files.length} image(s) selected</p>
        )}
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
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
