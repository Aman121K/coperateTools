import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function ShippingCalculator() {
  const [weight, setWeight] = useState(5);
  const [distance, setDistance] = useState(500);
  const [ratePerKg, setRatePerKg] = useState(50);
  const [baseFee, setBaseFee] = useState(100);
  const [result, setResult] = useState(0);

  useEffect(() => {
    const cost = baseFee + weight * ratePerKg + (distance / 100) * 10;
    setResult(Math.max(baseFee, cost));
  }, [weight, distance, ratePerKg, baseFee]);

  return (
    <ToolLayout title="Shipping Cost Estimator" description="Estimate shipping cost by weight & distance. Purpose: Quote shipping for orders or compare carrier options." input="" output={String(result)} onInputChange={() => {}} toolId="shipping-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Weight (kg)</label>
          <NumberInput value={weight} onChange={setWeight} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Distance (km)</label>
          <NumberInput value={distance} onChange={setDistance} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Rate per kg (₹)</label>
          <NumberInput value={ratePerKg} onChange={setRatePerKg} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Base fee (₹)</label>
          <NumberInput value={baseFee} onChange={setBaseFee} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Estimated Cost</p>
          <p className="text-2xl font-bold text-[var(--accent)]">₹{result.toFixed(0)}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
