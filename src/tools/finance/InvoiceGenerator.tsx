import { useState } from 'react';
import { PDFDocument, PageSizes, StandardFonts } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';
import { Editor } from '../../components/Editor';

export function InvoiceGenerator() {
  const [company, setCompany] = useState('Your Company Ltd');
  const [client, setClient] = useState('Client Name');
  const [items, setItems] = useState([{ name: 'Item 1', qty: 1, rate: 100 }]);
  const [invoiceNo, setInvoiceNo] = useState('INV-001');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [output, setOutput] = useState('');

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

  const generate = () => {
    const json = {
      invoiceNo,
      date,
      from: company,
      to: client,
      items: items.map((i) => ({ ...i, amount: i.qty * i.rate })),
      subtotal,
      tax,
      total,
    };
    setOutput(JSON.stringify(json, null, 2));
  };

  const downloadPdf = async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage(PageSizes.A4);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const pageWidth = PageSizes.A4[0];
    const pageHeight = PageSizes.A4[1];
    let y = pageHeight - margin;

    page.drawText('INVOICE', { x: margin, y, size: 24, font: fontBold });
    y -= 30;

    page.drawText(company, { x: margin, y, size: 12, font: fontBold });
    y -= 16;
    page.drawText(`Invoice #: ${invoiceNo}`, { x: margin, y, size: 10, font: font });
    y -= 12;
    page.drawText(`Date: ${date}`, { x: margin, y, size: 10, font: font });
    y -= 24;

    page.drawText('Bill To:', { x: margin, y, size: 10, font: fontBold });
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

    const pdfBytes = await doc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `invoice-${invoiceNo}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout title="Invoice Generator" description="Generate invoice JSON/data. Purpose: Create structured invoice data for apps, APIs, or export without manual formatting." input="" output={output} onInputChange={() => {}} toolId="invoice-generator" singlePanel>
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
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Invoice #</label>
            <input value={invoiceNo} onChange={(e) => setInvoiceNo(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
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
          <button
            type="button"
            onClick={downloadPdf}
            className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text-primary)] font-medium"
          >
            Download PDF (A4)
          </button>
        </div>
        {output && (
          <Editor value={output} onChange={() => {}} language="json" height="256px" readOnly />
        )}
      </div>
    </ToolLayout>
  );
}
