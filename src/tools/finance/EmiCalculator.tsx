import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function EmiCalculator() {
  const [principal, setPrincipal] = useState(1000000);
  const [rate, setRate] = useState(10);
  const [tenure, setTenure] = useState(12);
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    const r = rate / 12 / 100;
    const n = tenure;
    if (r === 0) {
      setEmi(principal / n);
      setTotalInterest(0);
    } else {
      const e = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      setEmi(e);
      setTotalInterest(e * n - principal);
    }
  }, [principal, rate, tenure]);

  return (
    <ToolLayout title="EMI / Loan Calculator" description="Calculate monthly EMI for loans. Purpose: Plan loan repayments before borrowing or compare different loan options." input="" output="" onInputChange={() => {}} toolId="emi-calculator" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Principal (₹)</label>
          <NumberInput value={principal} onChange={setPrincipal} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Interest Rate (% p.a.)</label>
          <NumberInput value={rate} onChange={setRate} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tenure (months)</label>
          <NumberInput value={tenure} onChange={setTenure} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="space-y-2 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-xl font-bold text-[var(--accent)]">EMI: ₹{emi.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Interest: ₹{totalInterest.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-sm text-[var(--text-muted)]">Total Payment: ₹{(principal + totalInterest).toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
