import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function CommissionCalculator() {
  const [revenue, setRevenue] = useState(100000);
  const [rate, setRate] = useState(10);
  const [tiered, setTiered] = useState(false);
  const [tier1, setTier1] = useState(5);
  const [tier2, setTier2] = useState(10);
  const [tier2Threshold, setTier2Threshold] = useState(50000);
  const [result, setResult] = useState(0);

  useEffect(() => {
    if (!tiered) {
      setResult(revenue * (rate / 100));
    } else {
      const below = Math.min(revenue, tier2Threshold);
      const above = Math.max(0, revenue - tier2Threshold);
      setResult(below * (tier1 / 100) + above * (tier2 / 100));
    }
  }, [revenue, rate, tiered, tier1, tier2, tier2Threshold]);

  return (
    <ToolLayout title="Commission Calculator" description="Calculate sales commission (flat or tiered). Purpose: Compute commission payouts for reps or verify commission statements." input="" output={String(result)} onInputChange={() => {}} toolId="commission-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Revenue (₹)</label>
          <NumberInput value={revenue} onChange={setRevenue} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" checked={tiered} onChange={(e) => setTiered(e.target.checked)} />
          <span className="text-sm">Tiered commission</span>
        </label>
        {!tiered ? (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Rate (%)</label>
            <NumberInput value={rate} onChange={setRate} placeholder="e.g. 2.6 or 10" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tier 1: Up to ₹{tier2Threshold.toLocaleString()} (%)</label>
              <NumberInput value={tier1} onChange={setTier1} placeholder="e.g. 2.6" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tier 2: Above (%)</label>
              <NumberInput value={tier2} onChange={setTier2} placeholder="e.g. 3.9" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tier 2 threshold (₹)</label>
              <NumberInput value={tier2Threshold} onChange={setTier2Threshold} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
          </div>
        )}
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-2xl font-bold text-[var(--accent)]">Commission: ₹{result.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
