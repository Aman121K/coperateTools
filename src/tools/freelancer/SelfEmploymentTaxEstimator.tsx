import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function SelfEmploymentTaxEstimator() {
  const [netIncome, setNetIncome] = useState(500000);
  const [result, setResult] = useState({ seTax: 0, effectiveRate: 0 });

  useEffect(() => {
    // Simplified self-employment tax: ~15.3% (SS + Medicare equivalent) on 92.35% of net
    // India: simplified - professional tax, GST if applicable. Using a rough 15% as placeholder for "set aside"
    const taxable = netIncome * 0.9235;
    const seTax = taxable * 0.153; // US-style; for India this is illustrative
    const effectiveRate = netIncome > 0 ? (seTax / netIncome) * 100 : 0;
    setResult({ seTax, effectiveRate });
  }, [netIncome]);

  const output = JSON.stringify(
    {
      netIncome,
      estimatedSelfEmploymentTax: result.seTax,
      effectiveRatePercent: result.effectiveRate.toFixed(1),
      note: 'Estimate only. Consult a tax professional. Rates vary by country.',
    },
    null,
    2
  );

  return (
    <ToolLayout
      title="Self-Employment Tax Estimator"
      description="Estimate taxes to set aside as a freelancer or gig worker. Purpose: Plan quarterly tax payments and avoid surprises."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="self-employment-tax"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Net income (₹) this year</label>
          <NumberInput value={netIncome} onChange={setNetIncome} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">Estimated tax to set aside: ₹{result.seTax.toFixed(2)}</p>
          <p className="text-sm text-[var(--text-secondary)]">Effective rate: ~{result.effectiveRate.toFixed(1)}%</p>
          <p className="text-xs text-[var(--text-muted)] mt-2">This is an estimate. Tax rules vary by country. Consult a professional.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
