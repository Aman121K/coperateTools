import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ToolLayout } from '../../components/ToolLayout';
import { extractReadablePageText } from '../../utils/pdfText';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export function PdfToTxt() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setText('');
    setError('');
  };

  const extract = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(data).promise;
      const num = pdf.numPages;
      const parts: string[] = [];
      for (let i = 1; i <= num; i++) {
        const page = await pdf.getPage(i);
        const pageText = await extractReadablePageText(page);
        parts.push(pageText);
      }
      const result = parts.filter(Boolean).join('\n\n').trim();
      setText(result);
      if (!result) {
        setError('No readable text layer found. This PDF is likely image-only; run OCR first to make it searchable.');
      }
    } catch (e) {
      setError((e as Error).message || 'Extraction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="PDF to TXT"
      description="Extract text from PDF. Purpose: Copy content, search, or process document text."
      input=""
      output={text}
      onInputChange={() => {}}
      toolId="pdf-txt"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">Upload a PDF to extract its text content.</p>
        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)]"
        >
          {file ? file.name : 'Select PDF'}
        </button>
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        <button
          type="button"
          onClick={extract}
          disabled={!file || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? 'Extracting…' : 'Extract Text'}
        </button>
        {text && (
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)] max-h-80 overflow-y-auto">
            <pre className="text-sm text-[var(--text-primary)] whitespace-pre-wrap font-sans">{text}</pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
