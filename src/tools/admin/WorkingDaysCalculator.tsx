import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

export function WorkingDaysCalculator() {
  const [start, setStart] = useState('2024-01-01');
  const [end, setEnd] = useState('2024-12-31');
  const [excludeWeekends, setExcludeWeekends] = useState(true);
  const [result, setResult] = useState({ total: 0, working: 0 });

  useEffect(() => {
    const s = new Date(start);
    const e = new Date(end);
    if (isNaN(s.getTime()) || isNaN(e.getTime()) || s > e) {
      setResult({ total: 0, working: 0 });
      return;
    }
    let total = 0;
    let working = 0;
    const d = new Date(s);
    while (d <= e) {
      total++;
      const day = d.getDay();
      if (!excludeWeekends || (day !== 0 && day !== 6)) working++;
      d.setDate(d.getDate() + 1);
    }
    setResult({ total, working });
  }, [start, end, excludeWeekends]);

  return (
    <ToolLayout title="Working Days Calculator" description="Count business days between dates. Purpose: Project timelines, leave planning, or SLA calculations." input="" output={JSON.stringify(result, null, 2)} onInputChange={() => {}} toolId="working-days" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start Date</label>
          <input type="date" value={start} onChange={(e) => setStart(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">End Date</label>
          <input type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={excludeWeekends} onChange={(e) => setExcludeWeekends(e.target.checked)} />
          <span className="text-sm">Exclude weekends (Sat/Sun)</span>
        </label>
        {result.total > 0 && (
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 space-y-2">
            <p className="text-sm text-[var(--text-secondary)]">Total days: {result.total}</p>
            <p className="text-lg font-bold text-[var(--accent)]">Working days: {result.working}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
