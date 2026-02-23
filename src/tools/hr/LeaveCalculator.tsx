import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function LeaveCalculator() {
  const [total, setTotal] = useState(21);
  const [used, setUsed] = useState(5);
  const [pending, setPending] = useState(0);
  const [carryOver, setCarryOver] = useState(0);

  useEffect(() => {
    setPending(Math.max(0, total + carryOver - used));
  }, [total, used, carryOver]);

  return (
    <ToolLayout title="Leave Calculator" description="Track annual leave balance. Purpose: Monitor remaining leave days and plan time off without spreadsheet hassle." input="" output={String(pending)} onInputChange={() => {}} toolId="leave-calculator" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Total Leave (days/year)</label>
          <NumberInput value={total} onChange={setTotal} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Used (days)</label>
          <NumberInput value={used} onChange={setUsed} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Carry Over (days)</label>
          <NumberInput value={carryOver} onChange={setCarryOver} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Balance</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{pending} days</p>
        </div>
      </div>
    </ToolLayout>
  );
}
