import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { ToolLayout } from '../../components/ToolLayout';
import { extractReadablePageText } from '../../utils/pdfText';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

type OcrResult = {
  data?: {
    text?: string;
  };
};

type OcrProgress = {
  status?: string;
  progress?: number;
};

type TesseractLike = {
  recognize: (
    image: HTMLCanvasElement | string,
    language: string,
    options?: { logger?: (progress: OcrProgress) => void }
  ) => Promise<OcrResult>;
};

type WindowWithTesseract = Window & {
  Tesseract?: TesseractLike;
};

function normalizeOcrText(value: string): string {
  return value
    .normalize('NFKC')
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function loadTesseractFromCdn(): Promise<TesseractLike> {
  const w = window as WindowWithTesseract;
  if (w.Tesseract) return w.Tesseract;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector('script[data-ocr="tesseract"]') as HTMLScriptElement | null;
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true });
      existing.addEventListener('error', () => reject(new Error('Failed to load OCR engine.')), { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.async = true;
    script.dataset.ocr = 'tesseract';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load OCR engine from CDN.'));
    document.head.appendChild(script);
  });

  if (!w.Tesseract) {
    throw new Error('OCR engine unavailable after loading.');
  }
  return w.Tesseract;
}

export function PdfToTxt() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [status, setStatus] = useState('');
  const [ocrProgress, setOcrProgress] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setText('');
    setError('');
    setStatus('');
    setOcrProgress(null);
  };

  const extract = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setStatus('');
    setOcrProgress(null);
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
      if (result) {
        setText(result);
        setStatus(`Extracted text from embedded PDF layer (${num} page${num > 1 ? 's' : ''}).`);
        return;
      }

      setStatus(`No text layer found. Running OCR on ${num} page${num > 1 ? 's' : ''}...`);
      const tesseract = await loadTesseractFromCdn();
      const ocrParts: string[] = [];

      for (let i = 1; i <= num; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        canvas.width = Math.ceil(viewport.width);
        canvas.height = Math.ceil(viewport.height);
        const context = canvas.getContext('2d');
        if (!context) throw new Error('Unable to create canvas for OCR.');
        await page.render({ canvas, canvasContext: context, viewport }).promise;

        const ocr = await tesseract.recognize(canvas, 'eng', {
          logger: (progress) => {
            if (typeof progress.progress === 'number') {
              const combined = ((i - 1) + progress.progress) / num;
              setOcrProgress(Math.max(1, Math.min(99, Math.round(combined * 100))));
            }
          },
        });
        const pageText = normalizeOcrText(ocr.data?.text ?? '');
        if (pageText) ocrParts.push(pageText);
        setOcrProgress(Math.round((i / num) * 100));
        setStatus(`OCR processing page ${i}/${num}...`);
      }

      const ocrResult = ocrParts.join('\n\n').trim();
      setText(ocrResult);
      setStatus(ocrResult ? 'OCR completed successfully.' : '');
      setError(ocrResult ? '' : 'OCR completed but no text could be recognized. Try a clearer scan or higher quality PDF.');
    } catch (e) {
      const message = (e as Error).message || 'Extraction failed';
      if (message.toLowerCase().includes('cdn') || message.toLowerCase().includes('load ocr engine')) {
        setError('OCR engine could not be loaded. Check internet access to cdn.jsdelivr.net and try again.');
      } else {
        setError(message);
      }
      setStatus('');
    } finally {
      setLoading(false);
      setOcrProgress(null);
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
        <p className="text-sm text-[var(--text-muted)]">
          Upload a PDF to extract text. If the PDF is scan/image-only, OCR fallback runs automatically.
        </p>
        <p className="text-xs text-[var(--text-muted)]">
          OCR engine is loaded on demand from CDN and may take a few seconds on first use.
        </p>
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
        {status && <p className="text-sm text-[var(--text-secondary)]">{status}</p>}
        {loading && ocrProgress !== null && (
          <div className="space-y-1">
            <div className="h-2 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] overflow-hidden">
              <div className="h-full bg-[var(--accent)] transition-all duration-200" style={{ width: `${ocrProgress}%` }} />
            </div>
            <p className="text-xs text-[var(--text-muted)]">{ocrProgress}%</p>
          </div>
        )}
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
