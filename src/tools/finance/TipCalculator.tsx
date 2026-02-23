import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function TipCalculator() {
  const [billAmount, setBillAmount] = useState(100);
  const [tipPercent, setTipPercent] = useState(15);
  const [people, setPeople] = useState(1);
  const [result, setResult] = useState({ tip: 0, total: 0, perPerson: 0 });

  useEffect(() => {
    const tip = billAmount * (tipPercent / 100);
    const total = billAmount + tip;
    const perPerson = people > 0 ? total / people : total;
    setResult({ tip, total, perPerson });
  }, [billAmount, tipPercent, people]);

  return (
    <ToolLayout title="Tip Calculator" description="Calculate tip and split bill. Purpose: Restaurant bills, service tips, or splitting costs with friends." input="" output={JSON.stringify(result, null, 2)} onInputChange={() => {}} toolId="tip-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Bill Amount (₹)</label>
          <NumberInput value={billAmount} onChange={setBillAmount} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tip (%)</label>
          <div className="flex gap-2 flex-wrap">
            {[10, 15, 18, 20, 25].map((p) => (
              <button key={p} type="button" onClick={() => setTipPercent(p)} className={`px-3 py-1.5 rounded-[var(--radius-sm)] text-sm ${tipPercent === p ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border)]'}`}>
                {p}%
              </button>
            ))}
          </div>
          <NumberInput value={tipPercent} onChange={setTipPercent} placeholder="Custom %" className="w-full mt-2 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Split among (people)</label>
          <NumberInput value={people} onChange={setPeople} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">Tip: ₹{result.tip.toFixed(2)}</p>
          <p className="text-lg font-bold text-[var(--accent)]">Total: ₹{result.total.toFixed(2)}</p>
          {people > 1 && <p className="text-sm text-[var(--text-secondary)]">Per person: ₹{result.perPerson.toFixed(2)}</p>}
        </div>
      </div>
    </ToolLayout>
  );
}
