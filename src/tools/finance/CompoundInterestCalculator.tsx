import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(5);
  const [frequency, setFrequency] = useState<'yearly' | 'half-yearly' | 'quarterly' | 'monthly'>('yearly');
  const [result, setResult] = useState({ amount: 0, interest: 0 });

  useEffect(() => {
    const n = frequency === 'yearly' ? 1 : frequency === 'half-yearly' ? 2 : frequency === 'quarterly' ? 4 : 12;
    const amount = principal * Math.pow(1 + rate / 100 / n, n * years);
    setResult({ amount, interest: amount - principal });
  }, [principal, rate, years, frequency]);

  return (
    <ToolLayout title="Compound Interest Calculator" description="Calculate compound interest on investments. Purpose: FD, savings, retirement planning, or investment returns." input="" output={JSON.stringify(result, null, 2)} onInputChange={() => {}} toolId="compound-interest" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Principal (₹)</label>
          <NumberInput value={principal} onChange={setPrincipal} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Annual Rate (%)</label>
          <NumberInput value={rate} onChange={setRate} placeholder="e.g. 8" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Time (years)</label>
          <NumberInput value={years} onChange={setYears} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Compounding</label>
          <select value={frequency} onChange={(e) => setFrequency(e.target.value as typeof frequency)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
            <option value="yearly">Yearly</option>
            <option value="half-yearly">Half-yearly</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">Interest earned: ₹{result.interest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-lg font-bold text-[var(--accent)]">Total amount: ₹{result.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
