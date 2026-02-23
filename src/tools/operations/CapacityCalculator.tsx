import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function CapacityCalculator() {
  const [totalHours, setTotalHours] = useState(160);
  const [utilization, setUtilization] = useState(80);
  const [result, setResult] = useState(0);

  useEffect(() => {
    setResult((totalHours * utilization) / 100);
  }, [totalHours, utilization]);

  return (
    <ToolLayout title="Capacity Calculator" description="Calculate effective capacity (hours × utilization). Purpose: Plan team capacity for projects or resource allocation." input="" output={String(result)} onInputChange={() => {}} toolId="capacity-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Total Hours (e.g. monthly)</label>
          <NumberInput value={totalHours} onChange={setTotalHours} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Utilization (%)</label>
          <NumberInput value={utilization} onChange={setUtilization} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Effective Capacity</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{result.toFixed(1)} hours</p>
        </div>
      </div>
    </ToolLayout>
  );
}
