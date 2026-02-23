import { useState } from 'react';
import { PDFDocument, PageSizes, StandardFonts } from 'pdf-lib';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function TimesheetGenerator() {
  const [workerName, setWorkerName] = useState('Your Name');
  const [clientName, setClientName] = useState('Client Name');
  const [periodStart, setPeriodStart] = useState(new Date().toISOString().slice(0, 10));
  const [periodEnd, setPeriodEnd] = useState(new Date().toISOString().slice(0, 10));
  const [entries, setEntries] = useState([{ date: new Date().toISOString().slice(0, 10), hours: 8, description: 'Project work' }]);
  const [hourlyRate, setHourlyRate] = useState(500);

  const totalHours = entries.reduce((s, e) => s + e.hours, 0);
  const totalAmount = totalHours * hourlyRate;

  const addEntry = () => setEntries([...entries, { date: new Date().toISOString().slice(0, 10), hours: 0, description: '' }]);
  const updateEntry = (i: number, f: string, v: string | number) => {
    const next = [...entries];
    (next[i] as Record<string, unknown>)[f] = v;
    setEntries(next);
  };
  const removeEntry = (i: number) => setEntries(entries.filter((_, j) => j !== i));

  const downloadPdf = async () => {
    const doc = await PDFDocument.create();
    const page = doc.addPage(PageSizes.A4);
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const fontBold = await doc.embedFont(StandardFonts.HelveticaBold);

    const margin = 50;
    let y = PageSizes.A4[1] - margin;

    page.drawText('TIMESHEET', { x: margin, y, size: 20, font: fontBold });
    y -= 24;

    page.drawText(`Worker: ${workerName}`, { x: margin, y, size: 10, font: font });
    y -= 12;
    page.drawText(`Client: ${clientName}`, { x: margin, y, size: 10, font: font });
    y -= 12;
    page.drawText(`Period: ${periodStart} to ${periodEnd}`, { x: margin, y, size: 10, font: font });
    y -= 20;

    page.drawText('Date', { x: margin, y, size: 10, font: fontBold });
    page.drawText('Hours', { x: margin + 120, y, size: 10, font: fontBold });
    page.drawText('Description', { x: margin + 180, y, size: 10, font: fontBold });
    y -= 14;

    entries.forEach((e) => {
      page.drawText(e.date, { x: margin, y, size: 9, font: font });
      page.drawText(String(e.hours), { x: margin + 120, y, size: 9, font: font });
      page.drawText((e.description || '—').slice(0, 40), { x: margin + 180, y, size: 9, font: font });
      y -= 12;
    });

    y -= 12;
    page.drawText(`Total Hours: ${totalHours.toFixed(1)}`, { x: margin, y, size: 10, font: fontBold });
    page.drawText(`Rate: ₹${hourlyRate}/hr`, { x: margin + 200, y, size: 10, font: font });
    y -= 14;
    page.drawText(`Total Amount: ₹${totalAmount.toFixed(2)}`, { x: margin, y, size: 12, font: fontBold });

    const pdfBytes = await doc.save();
    const blob = new Blob([new Uint8Array(pdfBytes)], { type: 'application/pdf' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `timesheet-${periodStart}-${periodEnd}.pdf`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const output = JSON.stringify(
    { workerName, clientName, periodStart, periodEnd, entries, hourlyRate, totalHours, totalAmount },
    null,
    2
  );

  return (
    <ToolLayout
      title="Timesheet Generator"
      description="Create a timesheet for billing clients. Track hours by date and description. Purpose: Invoice clients or track freelance hours."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="timesheet-generator"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your name</label>
            <input value={workerName} onChange={(e) => setWorkerName(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Client name</label>
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Period start</label>
            <input type="date" value={periodStart} onChange={(e) => setPeriodStart(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Period end</label>
            <input type="date" value={periodEnd} onChange={(e) => setPeriodEnd(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Hourly rate (₹)</label>
            <NumberInput value={hourlyRate} onChange={setHourlyRate} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Entries</label>
            <button type="button" onClick={addEntry} className="text-sm text-[var(--accent)] hover:underline">
              + Add row
            </button>
          </div>
          <div className="space-y-2">
            {entries.map((e, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="date" value={e.date} onChange={(ev) => updateEntry(i, 'date', ev.target.value)} className="w-36 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" />
                <NumberInput value={e.hours} onChange={(n) => updateEntry(i, 'hours', n)} className="w-20 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" placeholder="hrs" />
                <input value={e.description} onChange={(ev) => updateEntry(i, 'description', ev.target.value)} className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" placeholder="Description" />
                <button type="button" onClick={() => removeEntry(i)} className="p-2 text-[var(--text-muted)] hover:text-[var(--error)]">
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 flex justify-between items-center">
          <span className="font-medium">Total: {totalHours.toFixed(1)} hrs × ₹{hourlyRate} = ₹{totalAmount.toFixed(2)}</span>
          <button type="button" onClick={downloadPdf} className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] text-white font-medium hover:bg-[var(--accent-hover)]">
            Download PDF
          </button>
        </div>
      </div>
    </ToolLayout>
  );
}
