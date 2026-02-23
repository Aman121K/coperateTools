import { useState, useEffect, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';
import { ToolLayout } from '../../components/ToolLayout';

// PDF.js worker - use CDN for browser compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

type OutputFormat = 'image/png' | 'image/jpeg';

export function PdfToImages() {
  const [file, setFile] = useState<File | null>(null);
  const [pages, setPages] = useState<{ url: string; pageNum: number }[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageRange, setPageRange] = useState('1-'); // 1- means all
  const [format, setFormat] = useState<OutputFormat>('image/png');
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    return () => pages.forEach((p) => URL.revokeObjectURL(p.url));
  }, [pages]);

  const loadPdf = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setPages([]);
    try {
      const data = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument(data).promise;
      const num = pdf.numPages;
      setTotalPages(num);

      let from = 1;
      let to = num;
      const range = pageRange.trim();
      if (range) {
        const match = range.match(/^(\d+)-(\d*)$/);
        if (match) {
          from = Math.max(1, parseInt(match[1], 10));
          to = match[2] ? Math.min(num, parseInt(match[2], 10)) : num;
        }
      }

      const results: { url: string; pageNum: number }[] = [];
      for (let i = from; i <= to; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale });
        const canvas = document.createElement('canvas');
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext('2d')!;
        const task = page.render({
          canvas,
          canvasContext: ctx,
          viewport,
        });
        await task.promise;
        const blob = await new Promise<Blob>((resolve) => {
          canvas.toBlob((b) => resolve(b!), format, 0.95);
        });
        results.push({
          url: URL.createObjectURL(blob),
          pageNum: i,
        });
      }
      setPages(results);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const downloadOne = (url: string, pageNum: number) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `page-${pageNum}.${format === 'image/png' ? 'png' : 'jpg'}`;
    a.click();
  };

  const downloadZip = async () => {
    const zip = new JSZip();
    for (const { url, pageNum } of pages) {
      const res = await fetch(url);
      const blob = await res.blob();
      zip.file(`page-${pageNum}.${format === 'image/png' ? 'png' : 'jpg'}`, blob);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'pdf-pages.zip';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleRestoreFromShare = useCallback((data: Record<string, unknown>) => {
    if (typeof data.pageRange === 'string') setPageRange(data.pageRange);
    if (typeof data.format === 'string') setFormat(data.format as OutputFormat);
    if (typeof data.scale === 'number') setScale(data.scale);
  }, []);

  return (
    <ToolLayout
      title="PDF → Images"
      description="Convert PDF pages to PNG or JPG. Purpose: Extract pages as images for slides, thumbnails, or editing."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="pdf-images"
      singlePanel
      showCopyMinified={false}
      shareData={{ pageRange, format, scale }}
      onRestoreFromShare={handleRestoreFromShare}
    >
      <div className="space-y-6">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">PDF file</label>
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFile(f ?? null);
                setPages([]);
                setTotalPages(0);
              }}
              className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--accent)] file:text-white file:cursor-pointer"
            />
          </div>
          {file && (
            <>
              <div className="flex flex-wrap gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Pages (e.g. 1-5 or 1-)</label>
                  <input
                    type="text"
                    value={pageRange}
                    onChange={(e) => setPageRange(e.target.value)}
                    placeholder={`1-${totalPages || 'all'}`}
                    className="w-32 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as OutputFormat)}
                    className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                  >
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Scale: {scale}x</label>
                  <input
                    type="range"
                    min={1}
                    max={4}
                    step={0.5}
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="w-24"
                  />
                </div>
                <div className="self-end">
                  <button
                    type="button"
                    onClick={loadPdf}
                    disabled={loading}
                    className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium disabled:opacity-50"
                  >
                    {loading ? 'Converting...' : 'Convert'}
                  </button>
                </div>
              </div>
              {totalPages > 0 && (
                <p className="text-xs text-[var(--text-muted)]">{totalPages} page(s) in PDF</p>
              )}
            </>
          )}
        </div>

        {error && (
          <p className="text-sm text-[var(--error)]">⚠ {error}</p>
        )}

        {pages.length > 0 && (
          <>
            <div className="flex items-center justify-between p-3 rounded-[var(--radius)] bg-[var(--success)]/10 border border-[var(--success)]/30">
              <span className="text-sm font-medium text-[var(--success)]">
                {pages.length} page(s) converted
              </span>
              <button
                type="button"
                onClick={downloadZip}
                className="px-3 py-1.5 text-sm rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
              >
                Download ZIP
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {pages.map(({ url, pageNum }) => (
                <div key={pageNum} className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden bg-[var(--bg-tertiary)]">
                  <div className="aspect-[3/4] flex items-center justify-center p-2 bg-[var(--bg-secondary)]">
                    <img src={url} alt={`Page ${pageNum}`} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div className="p-2 flex items-center justify-between">
                    <span className="text-xs text-[var(--text-secondary)]">Page {pageNum}</span>
                    <button
                      type="button"
                      onClick={() => downloadOne(url, pageNum)}
                      className="text-xs text-[var(--accent)] hover:underline"
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
