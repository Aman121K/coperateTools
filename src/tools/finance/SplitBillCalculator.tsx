import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function SplitBillCalculator() {
  const [total, setTotal] = useState(100);
  const [people, setPeople] = useState(2);
  const [perPerson, setPerPerson] = useState(50);

  useEffect(() => {
    setPerPerson(people > 0 ? total / people : total);
  }, [total, people]);

  return (
    <ToolLayout title="Split Bill Calculator" description="Split a total amount equally among people. Purpose: Rent, utilities, groceries, or shared expenses." input="" output={String(perPerson.toFixed(2))} onInputChange={() => {}} toolId="split-bill" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Total Amount (₹)</label>
          <NumberInput value={total} onChange={setTotal} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Split among (people)</label>
          <NumberInput value={people} onChange={setPeople} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-lg font-bold text-[var(--accent)]">Per person: ₹{perPerson.toFixed(2)}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
