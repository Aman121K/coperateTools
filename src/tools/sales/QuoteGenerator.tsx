import { useState, useCallback } from 'react';
import { PDFDocument, PageSizes, StandardFonts } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';
import { Editor } from '../../components/Editor';

type SignatureMode = 'none' | 'single' | 'both';

export function QuoteGenerator() {
  const [company, setCompany] = useState('Your Company');
  const [client, setClient] = useState('Client Name');
  const [validity, setValidity] = useState(30);
  const [items, setItems] = useState([{ name: 'Service 1', qty: 1, rate: 1000 }]);
  const [output, setOutput] = useState('');
  const [quoteNo, setQuoteNo] = useState('');
  const [signatureMode, setSignatureMode] = useState<SignatureMode>('both');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const addItem = () => setItems([...items, { name: '', qty: 1, rate: 0 }]);
  const updateItem = (i: number, f: string, v: string | number) => {
    const next = [...items];
    (next[i] as Record<string, unknown>)[f] = v;
    setItems(next);
  };
  const removeItem = (i: number) => setItems(items.filter((_, j) => j !== i));

  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const tax = subtotal * 0.18;
  const total = subtotal + tax;

  const buildPdf = useCallback(async (): Promise<Uint8Array> => {
    const doc = await PDFDocument.create();
    const page = doc.addPage(PageSizes.A4);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const pageWidth = PageSizes.A4[0];
    const pageHeight = PageSizes.A4[1];
    let y = pageHeight - margin;

    const qNo = quoteNo || `QT-${Date.now().toString(36).toUpperCase()}`;
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validity);

    page.drawText('QUOTE', { x: margin, y, size: 24, font: fontBold });
    y -= 30;

    page.drawText(company, { x: margin, y, size: 12, font: fontBold });
    y -= 16;
    page.drawText(`Quote #: ${qNo}`, { x: margin, y, size: 10, font: font });
    y -= 12;
    page.drawText(`Valid until: ${validUntil.toISOString().slice(0, 10)}`, { x: margin, y, size: 10, font: font });
    y -= 24;

    page.drawText('Quote To:', { x: margin, y, size: 10, font: fontBold });
    y -= 12;
    page.drawText(client, { x: margin, y, size: 10, font: font });
    y -= 24;

    page.drawText('Item', { x: margin, y, size: 10, font: fontBold });
    page.drawText('Qty', { x: pageWidth - margin - 180, y, size: 10, font: fontBold });
    page.drawText('Rate', { x: pageWidth - margin - 120, y, size: 10, font: fontBold });
    page.drawText('Amount', { x: pageWidth - margin - 60, y, size: 10, font: fontBold });
    y -= 16;

    items.forEach((item) => {
      const amount = item.qty * item.rate;
      page.drawText(item.name || '—', { x: margin, y, size: 10, font: font });
      page.drawText(String(item.qty), { x: pageWidth - margin - 180, y, size: 10, font: font });
      page.drawText(item.rate.toFixed(2), { x: pageWidth - margin - 120, y, size: 10, font: font });
      page.drawText(amount.toFixed(2), { x: pageWidth - margin - 60, y, size: 10, font: font });
      y -= 14;
    });

    y -= 8;
    page.drawText(`Subtotal: ${subtotal.toFixed(2)}`, { x: pageWidth - margin - 120, y, size: 10, font: font });
    y -= 12;
    page.drawText(`Tax (18%): ${tax.toFixed(2)}`, { x: pageWidth - margin - 120, y, size: 10, font: font });
    y -= 12;
    page.drawText(`Total: ${total.toFixed(2)}`, { x: pageWidth - margin - 120, y, size: 12, font: fontBold });
    y -= 40;

    if (signatureMode === 'single' || signatureMode === 'both') {
      const sigWidth = signatureMode === 'both' ? (pageWidth - 2 * margin) / 2 - 20 : pageWidth - 2 * margin;

      if (signatureMode === 'single') {
        page.drawLine({ start: { x: margin, y }, end: { x: margin + sigWidth, y }, thickness: 0.5 });
        y -= 8;
        page.drawText('Authorized Signatory', { x: margin, y, size: 9, font: font });
        y -= 12;
        page.drawText(company, { x: margin, y, size: 10, font: fontBold });
      } else {
        const sigX2 = pageWidth / 2 + 10;
        page.drawLine({ start: { x: margin, y }, end: { x: margin + sigWidth, y }, thickness: 0.5 });
        page.drawLine({ start: { x: sigX2, y }, end: { x: sigX2 + sigWidth, y }, thickness: 0.5 });
        y -= 8;
        page.drawText('Authorized Signatory', { x: margin, y, size: 9, font: font });
        page.drawText('Authorized Signatory', { x: sigX2, y, size: 9, font: font });
        y -= 12;
        page.drawText(company, { x: margin, y, size: 10, font: fontBold });
        page.drawText(client, { x: sigX2, y, size: 10, font: fontBold });
      }
    }

    return await doc.save();
  }, [company, client, items, subtotal, tax, total, validity, quoteNo, signatureMode]);

  const generate = () => {
    const qNo = quoteNo || `QT-${Date.now().toString(36).toUpperCase()}`;
    setQuoteNo(qNo);
    const quote = {
      from: company,
      to: client,
      validityDays: validity,
      items: items.map((i) => ({ ...i, amount: i.qty * i.rate })),
      subtotal,
      tax,
      total,
      quoteNo: qNo,
    };
    setOutput(JSON.stringify(quote, null, 2));
    buildPdf().then((bytes) => {
      setPdfPreviewUrl((prev) => {
        if (prev) URL.revokeObjectURL(prev);
        return URL.createObjectURL(new Blob([new Uint8Array(bytes)], { type: 'application/pdf' }));
      });
    });
  };

  const downloadPdf = async () => {
    const bytes = await buildPdf();
    const blob = new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `quote-${quoteNo || 'QT'}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout title="Quote Generator" description="Generate sales quote data. Purpose: Create structured quotes for proposals, CRM, or customer communication." input="" output={output} onInputChange={() => {}} toolId="quote-generator" singlePanel>
      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your Company</label>
            <input value={company} onChange={(e) => setCompany(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Client</label>
            <input value={client} onChange={(e) => setClient(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Quote Validity (days)</label>
          <NumberInput value={validity} onChange={setValidity} className="w-32 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Signatures</label>
          <select
            value={signatureMode}
            onChange={(e) => setSignatureMode(e.target.value as SignatureMode)}
            className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]"
          >
            <option value="none">No signatures</option>
            <option value="single">Single party (Company only)</option>
            <option value="both">Both parties (Company + Client)</option>
          </select>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Items</label>
            <button type="button" onClick={addItem} className="text-sm text-[var(--accent)] hover:underline">+ Add</button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Item" className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" />
                <NumberInput value={item.qty} onChange={(n) => updateItem(i, 'qty', n)} placeholder="Qty" className="w-20 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" />
                <NumberInput value={item.rate} onChange={(n) => updateItem(i, 'rate', n)} placeholder="Rate" className="w-24 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" />
                <button type="button" onClick={() => removeItem(i)} className="text-[var(--error)]">×</button>
              </div>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium">
            Generate
          </button>
          {output && (
            <button
              type="button"
              onClick={downloadPdf}
              className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text-primary)] font-medium"
            >
              Download PDF (A4)
            </button>
          )}
        </div>
        {pdfPreviewUrl && output && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-[var(--text-secondary)]">PDF Preview</p>
            <div className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden bg-white">
              <iframe src={pdfPreviewUrl} title="Quote PDF Preview" className="w-full h-[500px]" />
            </div>
          </div>
        )}
        {output && <Editor value={output} onChange={() => {}} language="json" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
