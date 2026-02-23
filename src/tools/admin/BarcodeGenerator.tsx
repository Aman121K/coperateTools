import { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { ToolLayout } from '../../components/ToolLayout';

const TYPES = ['CODE128', 'CODE39', 'EAN13', 'EAN8', 'UPC', 'ITF14'];

export function BarcodeGenerator() {
  const [text, setText] = useState('1234567890');
  const [type, setType] = useState('CODE128');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!canvasRef.current || !text.trim()) return;
    try {
      JsBarcode(canvasRef.current, text, { format: type, width: 2, height: 80, displayValue: true });
      setError('');
    } catch (e) {
      setError((e as Error).message);
    }
  }, [text, type]);

  const download = () => {
    if (!canvasRef.current) return;
    const a = document.createElement('a');
    a.href = canvasRef.current.toDataURL('image/png');
    a.download = 'barcode.png';
    a.click();
  };

  return (
    <ToolLayout title="Barcode Generator" description="Generate barcodes (CODE128, EAN13, etc.). Purpose: Create product labels, SKU IDs, or inventory barcodes for printing." input={text} output="" onInputChange={setText} toolId="barcode-generator" singlePanel showCopyMinified={false}>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Data</label>
          <input value={text} onChange={(e) => setText(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="1234567890" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Type</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        {text && (
          <div className="flex flex-col items-center gap-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <canvas ref={canvasRef} />
            <button type="button" onClick={download} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Download PNG</button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
