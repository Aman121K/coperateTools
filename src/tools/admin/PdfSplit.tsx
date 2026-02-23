import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';

export function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f && f.type === 'application/pdf' ? f : null);
    setError('');
  };

  const split = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const bytes = await file.arrayBuffer();
      const doc = await PDFDocument.load(bytes);
      const num = doc.getPageCount();
      for (let i = 0; i < num; i++) {
        const newDoc = await PDFDocument.create();
        const [page] = await newDoc.copyPages(doc, [i]);
        newDoc.addPage(page);
        const pdfBytes = await newDoc.save();
        const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${file.name.replace('.pdf', '')}-page-${i + 1}.pdf`;
        a.click();
        URL.revokeObjectURL(a.href);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout title="PDF Splitter" description="Split PDF into individual pages. Purpose: Extract specific pages or split large documents for separate use." input="" output="" onInputChange={() => {}} toolId="pdf-split" singlePanel showCopyMinified={false} shareData={{ file: file?.name }}>
      <div className="max-w-lg space-y-4">
        <input type="file" accept="application/pdf" onChange={handleFile} className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-[var(--accent)] file:text-white" />
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        {file && (
          <div>
            <p className="text-sm text-[var(--text-muted)] mb-2">{file.name}</p>
            <button type="button" onClick={split} disabled={loading} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white disabled:opacity-50">
              {loading ? 'Splitting...' : 'Split & Download Pages'}
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
