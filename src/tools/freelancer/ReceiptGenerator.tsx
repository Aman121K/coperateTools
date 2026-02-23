import { useState } from 'react';
import { PDFDocument, PageSizes, StandardFonts } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function ReceiptGenerator() {
  const [providerName, setProviderName] = useState('Your Name / Business');
  const [clientName, setClientName] = useState('Client Name');
  const [serviceDescription, setServiceDescription] = useState('Consulting / Design / Development');
  const [amount, setAmount] = useState(5000);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [receiptNo, setReceiptNo] = useState(`RCP-${Date.now().toString(36).toUpperCase().slice(-6)}`);

  const downloadPdf = async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage(PageSizes.A4);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    const pageWidth = PageSizes.A4[0];
    let y = PageSizes.A4[1] - margin;

    page.drawText('RECEIPT', { x: margin, y, size: 22, font: fontBold });
    y -= 28;

    page.drawText(`Receipt #: ${receiptNo}`, { x: margin, y, size: 10, font: font });
    y -= 12;
    page.drawText(`Date: ${date}`, { x: margin, y, size: 10, font: font });
    y -= 24;

    page.drawText('Received from:', { x: margin, y, size: 10, font: fontBold });
    y -= 12;
    page.drawText(clientName, { x: margin, y, size: 10, font: font });
    y -= 20;

    page.drawText('For:', { x: margin, y, size: 10, font: fontBold });
    y -= 12;
    page.drawText(serviceDescription, { x: margin, y, size: 10, font: font });
    y -= 24;

    page.drawText('Amount:', { x: margin, y, size: 12, font: fontBold });
    page.drawText(`₹${amount.toFixed(2)}`, { x: pageWidth - margin - 80, y, size: 14, font: fontBold });
    y -= 40;

    page.drawText('Provided by:', { x: margin, y, size: 10, font: font });
    y -= 12;
    page.drawText(providerName, { x: margin, y, size: 10, font: fontBold });

    const pdfBytes = await doc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `receipt-${receiptNo}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const output = JSON.stringify({ receiptNo, date, from: clientName, to: providerName, service: serviceDescription, amount }, null, 2);

  return (
    <ToolLayout
      title="Receipt Generator"
      description="Create a simple receipt for services rendered. Purpose: Provide proof of payment to clients after gig work."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="receipt-generator"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your name / business</label>
          <input value={providerName} onChange={(e) => setProviderName(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Client name</label>
          <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Service description</label>
          <input value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount (₹)</label>
          <NumberInput value={amount} onChange={setAmount} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Receipt #</label>
            <input value={receiptNo} onChange={(e) => setReceiptNo(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        </div>
        <button type="button" onClick={downloadPdf} className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)]">
          Download Receipt (PDF)
        </button>
      </div>
    </ToolLayout>
  );
}
