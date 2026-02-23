import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

export function DateCalculator() {
  const [date1, setDate1] = useState('2024-01-01');
  const [date2, setDate2] = useState('2024-12-31');
  const [result, setResult] = useState('');

  useEffect(() => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diff = Math.abs(d2.getTime() - d1.getTime());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);
    const years = Math.floor(days / 365);
    setResult(`${days} days (${weeks} weeks, ~${months} months, ~${years} years)`);
  }, [date1, date2]);

  return (
    <ToolLayout title="Date Calculator" description="Calculate difference between two dates. Purpose: Find project duration, age, tenure, or days until deadline." input="" output={result} onInputChange={() => {}} toolId="date-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start Date</label>
          <input type="date" value={date1} onChange={(e) => setDate1(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">End Date</label>
          <input type="date" value={date2} onChange={(e) => setDate2(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Difference</p>
          <p className="text-lg font-bold text-[var(--accent)]">{result}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
