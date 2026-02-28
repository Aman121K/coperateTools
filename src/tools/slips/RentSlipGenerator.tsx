import { useEffect, useMemo, useState } from 'react';
import { PDFDocument, StandardFonts } from 'pdf-lib';
import { Editor } from '../../components/Editor';
import { ToolLayout } from '../../components/ToolLayout';

export function RentSlipGenerator() {
  const [tenantName, setTenantName] = useState('');
  const [landlordName, setLandlordName] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [rentMonth, setRentMonth] = useState('');
  const [paidDate, setPaidDate] = useState('');
  const [amount, setAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState('Bank Transfer');
  const [slipNo, setSlipNo] = useState(`RENT-${Date.now().toString().slice(-6)}`);
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfError, setPdfError] = useState('');

  const lines = useMemo(
    () => [
      'RENT PAYMENT SLIP',
      `Slip No: ${slipNo || '-'}`,
      `Date: ${paidDate || '-'}`,
      '',
      `Tenant Name: ${tenantName || '-'}`,
      `Landlord Name: ${landlordName || '-'}`,
      `Property Address: ${propertyAddress || '-'}`,
      `Rent Month: ${rentMonth || '-'}`,
      `Amount Paid: ${amount || '-'}`,
      `Payment Mode: ${paymentMode || '-'}`,
      '',
      'Received By:',
      'Signature: __________________',
    ],
    [amount, landlordName, paidDate, paymentMode, propertyAddress, rentMonth, slipNo, tenantName]
  );

  const output = lines.join('\n');

  const buildPdfBlob = async (): Promise<Blob> => {
    const doc = await PDFDocument.create();
    const page = doc.addPage([595, 842]);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);

    page.drawText('RENT PAYMENT SLIP', {
      x: 44,
      y: 790,
      size: 18,
      font: bold,
    });

    let y = 752;
    for (const line of lines.slice(1)) {
      page.drawText(line, {
        x: 44,
        y,
        size: 12,
        font,
      });
      y -= line ? 22 : 14;
    }

    const bytes = await doc.save();
    return new Blob([new Uint8Array(bytes)], { type: 'application/pdf' });
  };

  useEffect(() => {
    let active = true;
    const generate = async () => {
      try {
        const blob = await buildPdfBlob();
        if (!active) return;
        const nextUrl = URL.createObjectURL(blob);
        setPdfUrl((prev) => {
          if (prev) URL.revokeObjectURL(prev);
          return nextUrl;
        });
        setPdfError('');
      } catch {
        if (active) setPdfError('Unable to generate PDF preview.');
      }
    };
    void generate();
    return () => {
      active = false;
    };
  }, [lines]);

  useEffect(() => {
    return () => {
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
    };
  }, [pdfUrl]);

  const downloadPdf = () => {
    if (!pdfUrl) return;
    const a = document.createElement('a');
    a.href = pdfUrl;
    a.download = `${(slipNo || 'rent-slip').replace(/\s+/g, '-')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <ToolLayout
      title="Rent Slip Generator"
      description="Create printable rent payment slips for monthly rent records."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="rent-slip-generator"
      showCopyMinified={false}
      showDownload={false}
    >
      <div className="grid gap-4 md:grid-cols-2">
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Tenant Name" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Landlord Name" value={landlordName} onChange={(e) => setLandlordName(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Property Address" value={propertyAddress} onChange={(e) => setPropertyAddress(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Rent Month (e.g. Feb 2026)" value={rentMonth} onChange={(e) => setRentMonth(e.target.value)} />
        <input type="date" className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" value={paidDate} onChange={(e) => setPaidDate(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Amount (e.g. 25000)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <input className="px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Payment Mode" value={paymentMode} onChange={(e) => setPaymentMode(e.target.value)} />
        <input className="md:col-span-2 px-3 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" placeholder="Slip Number" value={slipNo} onChange={(e) => setSlipNo(e.target.value)} />
        <div className="md:col-span-2">
          <Editor value={output} onChange={() => {}} language="plaintext" height="240px" readOnly />
        </div>
        <div className="md:col-span-2 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-tertiary)] p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">PDF Preview</h3>
            <button
              type="button"
              onClick={downloadPdf}
              disabled={!pdfUrl}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white text-sm font-medium"
            >
              Download PDF
            </button>
          </div>
          {pdfError && <p className="text-sm text-[var(--error)]">⚠ {pdfError}</p>}
          {pdfUrl && (
            <iframe
              src={pdfUrl}
              title="Rent Slip PDF Preview"
              className="w-full h-[520px] rounded-[var(--radius-sm)] border border-[var(--border)] bg-white"
            />
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
