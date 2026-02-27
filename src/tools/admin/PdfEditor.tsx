import { useEffect, useMemo, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function wrapLines(text: string, maxChars = 95): string[] {
  const lines: string[] = [];
  const blocks = text.split('\n');
  for (const block of blocks) {
    if (!block.trim()) {
      lines.push('');
      continue;
    }
    let current = '';
    const words = block.split(/\s+/);
    for (const word of words) {
      if (!current) {
        current = word;
        continue;
      }
      if ((current + ' ' + word).length <= maxChars) {
        current += ` ${word}`;
      } else {
        lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);
  }
  return lines;
}

export function PdfEditor() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<string[]>([]);
  const [selectedPage, setSelectedPage] = useState(0);
  const [previewUrl, setPreviewUrl] = useState('');
  const [sourcePdfBytes, setSourcePdfBytes] = useState<Uint8Array | null>(null);
  const [visualPage, setVisualPage] = useState(1);
  const [stampText, setStampText] = useState('Approved');
  const [stampX, setStampX] = useState(80);
  const [stampY, setStampY] = useState(80);
  const [stampSize, setStampSize] = useState(18);
  const [stampColor, setStampColor] = useState('#d11f1f');
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [imageX, setImageX] = useState(80);
  const [imageY, setImageY] = useState(140);
  const [imageWidth, setImageWidth] = useState(140);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const hasContent = pages.length > 0;

  const totalWords = useMemo(
    () => pages.join('\n ').trim().split(/\s+/).filter(Boolean).length,
    [pages]
  );

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  useEffect(() => {
    setVisualPage(selectedPage + 1);
  }, [selectedPage]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(f ? URL.createObjectURL(f) : '');
    setFile(f ?? null);
    setPages([]);
    setSelectedPage(0);
    setSourcePdfBytes(null);
    setVisualPage(1);
    setError('');
  };

  const loadPdfForEdit = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    try {
      const data = await file.arrayBuffer();
      setSourcePdfBytes(new Uint8Array(data));
      const pdf = await pdfjsLib.getDocument(data).promise;
      const nextPages: string[] = [];
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const text = content.items
          .map((item) => ('str' in item ? item.str : ''))
          .join(' ');
        nextPages.push(text);
      }
      setPages(nextPages);
      setSelectedPage(0);
      setVisualPage(1);
    } catch (e) {
      setError((e as Error).message || 'Failed to parse PDF.');
    } finally {
      setLoading(false);
    }
  };

  const updateCurrentPage = (value: string) => {
    setPages((prev) => prev.map((p, i) => (i === selectedPage ? value : p)));
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const href = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = href;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(href);
  };

  const saveAsPdf = async () => {
    if (!hasContent) return;
    setLoading(true);
    setError('');
    try {
      const doc = await PDFDocument.create();
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const fontSize = 11;
      const lineHeight = 16;
      const pageWidth = 595;
      const pageHeight = 842;
      const margin = 44;
      const maxLines = Math.floor((pageHeight - margin * 2) / lineHeight);

      for (const pageText of pages) {
        const wrapped = wrapLines(pageText);
        const chunks: string[][] = [];
        for (let i = 0; i < wrapped.length; i += maxLines) {
          chunks.push(wrapped.slice(i, i + maxLines));
        }
        if (chunks.length === 0) chunks.push(['']);
        for (const chunk of chunks) {
          const page = doc.addPage([pageWidth, pageHeight]);
          let y = pageHeight - margin;
          for (const line of chunk) {
            page.drawText(line, {
              x: margin,
              y,
              size: fontSize,
              font,
              lineHeight,
            });
            y -= lineHeight;
          }
        }
      }

      const bytes = await doc.save();
      const outName = `${(file?.name || 'edited').replace(/\.pdf$/i, '')}-edited.pdf`;
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }), outName);
    } catch (e) {
      setError((e as Error).message || 'Failed to save PDF.');
    } finally {
      setLoading(false);
    }
  };

  const saveAsWord = () => {
    if (!hasContent) return;
    const escaped = pages
      .map((p, i) => {
        const safe = p
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/\n/g, '<br/>');
        return `<h3>Page ${i + 1}</h3><p>${safe || '&nbsp;'}</p>`;
      })
      .join('<div style="page-break-after: always;"></div>');

    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Edited Document</title></head><body style="font-family:Calibri,Arial,sans-serif;font-size:12pt;">${escaped}</body></html>`;
    const outName = `${(file?.name || 'edited').replace(/\.pdf$/i, '')}-edited.doc`;
    downloadBlob(new Blob([html], { type: 'application/msword' }), outName);
  };

  const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

  const saveVisualPdf = async () => {
    if (!sourcePdfBytes) return;
    setLoading(true);
    setError('');
    try {
      const doc = await PDFDocument.load(sourcePdfBytes);
      const pageIdx = clamp(visualPage - 1, 0, Math.max(0, doc.getPageCount() - 1));
      const page = doc.getPage(pageIdx);
      const pageHeight = page.getHeight();
      const font = await doc.embedFont(StandardFonts.HelveticaBold);

      if (stampText.trim()) {
        const r = parseInt(stampColor.slice(1, 3), 16) / 255;
        const g = parseInt(stampColor.slice(3, 5), 16) / 255;
        const b = parseInt(stampColor.slice(5, 7), 16) / 255;
        page.drawText(stampText.trim(), {
          x: clamp(stampX, 0, page.getWidth() - 20),
          y: clamp(pageHeight - stampY - stampSize, 0, pageHeight - stampSize),
          size: clamp(stampSize, 8, 72),
          font,
          color: rgb(r, g, b),
        });
      }

      if (imageDataUrl) {
        const isPng = imageDataUrl.startsWith('data:image/png');
        const image = isPng
          ? await doc.embedPng(imageDataUrl)
          : await doc.embedJpg(imageDataUrl);
        const ratio = image.height / image.width;
        const width = clamp(imageWidth, 20, page.getWidth() - 20);
        const height = width * ratio;
        page.drawImage(image, {
          x: clamp(imageX, 0, page.getWidth() - width),
          y: clamp(pageHeight - imageY - height, 0, pageHeight - height),
          width,
          height,
        });
      }

      const bytes = await doc.save();
      const outName = `${(file?.name || 'edited').replace(/\.pdf$/i, '')}-visual-edited.pdf`;
      downloadBlob(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }), outName);
    } catch (e) {
      setError((e as Error).message || 'Failed to save visual PDF.');
    } finally {
      setLoading(false);
    }
  };

  const handleVisualImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!f.type.startsWith('image/')) {
      setError('Please upload PNG/JPG image for visual overlay.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setImageDataUrl(String(reader.result || ''));
      setError('');
    };
    reader.onerror = () => setError('Unable to read image file.');
    reader.readAsDataURL(f);
  };

  return (
    <ToolLayout
      title="PDF Editor (Text)"
      description="Upload a PDF and edit with side-by-side page preview. You can export as PDF/Word or apply visual overlays."
      input=""
      output={pages.join('\n\n')}
      onInputChange={() => {}}
      toolId="pdf-editor"
      singlePanel
      showCopyMinified={false}
      showDownload={false}
    >
      <div className="max-w-5xl space-y-5">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_auto]">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full px-4 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-primary)] text-left"
          >
            {file ? file.name : 'Select PDF file'}
          </button>
          <button
            type="button"
            onClick={loadPdfForEdit}
            disabled={!file || loading}
            className="px-4 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
          >
            {loading ? 'Loading…' : 'Load PDF for Editing'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={saveAsPdf}
            disabled={!hasContent || loading}
            className="px-4 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] disabled:opacity-50 text-[var(--text-primary)] font-medium"
          >
            Save as PDF
          </button>
          <button
            type="button"
            onClick={saveAsWord}
            disabled={!hasContent || loading}
            className="px-4 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] disabled:opacity-50 text-[var(--text-primary)] font-medium"
          >
            Save as Word (.doc)
          </button>
        </div>

        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}

        {hasContent && (
          <>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
              <span className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">
                Pages: {pages.length}
              </span>
              <span className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">
                Words: {totalWords}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {pages.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedPage(i)}
                  className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm border ${
                    i === selectedPage
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-secondary)] border-[var(--border)]'
                  }`}
                >
                  Page {i + 1}
                </button>
              ))}
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-tertiary)] p-3">
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Original PDF Preview (Page {selectedPage + 1})
                </label>
                {previewUrl ? (
                  <iframe
                    title="PDF Preview"
                    src={`${previewUrl}#page=${selectedPage + 1}&view=FitH`}
                    className="w-full min-h-[420px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-white"
                  />
                ) : (
                  <div className="min-h-[420px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] flex items-center justify-center text-sm text-[var(--text-muted)]">
                    Select a PDF to open preview.
                  </div>
                )}
              </div>
              <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-tertiary)] p-3">
                <label className="block text-sm text-[var(--text-secondary)] mb-2">
                  Editing Page {selectedPage + 1} Text
                </label>
                <textarea
                  value={pages[selectedPage] ?? ''}
                  onChange={(e) => updateCurrentPage(e.target.value)}
                  className="w-full min-h-[420px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] p-3 text-sm text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-tertiary)] p-4 space-y-4">
              <h3 className="text-sm font-semibold text-[var(--text-primary)]">Visual PDF Editing (Sejda-style lite)</h3>
              <p className="text-xs text-[var(--text-muted)]">
                Add text or image/logo on a selected page and save as PDF. Coordinates are from top-left of the page.
              </p>

              <div className="grid gap-3 sm:grid-cols-4">
                <label className="text-xs text-[var(--text-secondary)]">
                  Page
                  <input type="number" min={1} max={pages.length} value={visualPage} onChange={(e) => setVisualPage(Number(e.target.value) || 1)} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm text-[var(--text-primary)]" />
                </label>
                <label className="text-xs text-[var(--text-secondary)]">
                  X
                  <input type="number" value={stampX} onChange={(e) => setStampX(Number(e.target.value) || 0)} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm text-[var(--text-primary)]" />
                </label>
                <label className="text-xs text-[var(--text-secondary)]">
                  Y
                  <input type="number" value={stampY} onChange={(e) => setStampY(Number(e.target.value) || 0)} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm text-[var(--text-primary)]" />
                </label>
                <label className="text-xs text-[var(--text-secondary)]">
                  Font Size
                  <input type="number" min={8} max={72} value={stampSize} onChange={(e) => setStampSize(Number(e.target.value) || 12)} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm text-[var(--text-primary)]" />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                <input
                  type="text"
                  value={stampText}
                  onChange={(e) => setStampText(e.target.value)}
                  placeholder="Text stamp (e.g. Approved, Draft, Signed)"
                  className="w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-3 py-2 text-sm text-[var(--text-primary)]"
                />
                <label className="text-xs text-[var(--text-secondary)]">
                  Color
                  <input type="color" value={stampColor} onChange={(e) => setStampColor(e.target.value)} className="mt-1 h-10 w-16 rounded border border-[var(--border)] bg-[var(--bg-secondary)]" />
                </label>
              </div>

              <div className="grid gap-3 sm:grid-cols-4">
                <label className="text-xs text-[var(--text-secondary)]">
                  Logo/Image
                  <input type="file" accept="image/png,image/jpeg" onChange={handleVisualImage} className="mt-1 block w-full text-xs text-[var(--text-secondary)]" />
                </label>
                <label className="text-xs text-[var(--text-secondary)]">
                  Img X
                  <input type="number" value={imageX} onChange={(e) => setImageX(Number(e.target.value) || 0)} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm text-[var(--text-primary)]" />
                </label>
                <label className="text-xs text-[var(--text-secondary)]">
                  Img Y
                  <input type="number" value={imageY} onChange={(e) => setImageY(Number(e.target.value) || 0)} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm text-[var(--text-primary)]" />
                </label>
                <label className="text-xs text-[var(--text-secondary)]">
                  Img Width
                  <input type="number" value={imageWidth} onChange={(e) => setImageWidth(Number(e.target.value) || 100)} className="mt-1 w-full rounded border border-[var(--border)] bg-[var(--bg-secondary)] px-2 py-1.5 text-sm text-[var(--text-primary)]" />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveVisualPdf}
                  disabled={!sourcePdfBytes || loading}
                  className="px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white text-sm font-medium"
                >
                  Save Visual Edits as PDF
                </button>
                {imageDataUrl && (
                  <button
                    type="button"
                    onClick={() => setImageDataUrl('')}
                    className="px-4 py-2.5 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-secondary)] text-sm"
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
