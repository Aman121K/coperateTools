import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function TaxCalculator() {
  const [amount, setAmount] = useState(100000);
  const [taxRate, setTaxRate] = useState(18);
  const [includeTax, setIncludeTax] = useState(false);
  const [result, setResult] = useState({ base: 0, tax: 0, total: 0 });

  useEffect(() => {
    if (includeTax) {
      const base = amount / (1 + taxRate / 100);
      const tax = amount - base;
      setResult({ base, tax, total: amount });
    } else {
      const tax = amount * (taxRate / 100);
      setResult({ base: amount, tax, total: amount + tax });
    }
  }, [amount, taxRate, includeTax]);

  return (
    <ToolLayout title="Tax Calculator" description="Calculate GST/tax on amount. Purpose: Compute tax on invoices, receipts, or prices before finalizing financial documents." input="" output={JSON.stringify(result, null, 2)} onInputChange={() => {}} toolId="tax-calculator" singlePanel>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount</label>
          <NumberInput value={amount} onChange={setAmount} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tax Rate (%)</label>
          <NumberInput value={taxRate} onChange={setTaxRate} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={includeTax} onChange={(e) => setIncludeTax(e.target.checked)} />
          <span className="text-sm">Amount includes tax</span>
        </label>
        <div className="space-y-2 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p><span className="text-[var(--text-muted)]">Base:</span> {result.base.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p><span className="text-[var(--text-muted)]">Tax:</span> {result.tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="font-bold"><span className="text-[var(--text-muted)]">Total:</span> {result.total.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
