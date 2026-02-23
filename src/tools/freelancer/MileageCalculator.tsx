import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function MileageCalculator() {
  const [distance, setDistance] = useState(50);
  const [ratePerKm, setRatePerKm] = useState(8);
  const [trips, setTrips] = useState(1);
  const [result, setResult] = useState({ totalKm: 0, totalAmount: 0 });

  useEffect(() => {
    const totalKm = distance * trips;
    const totalAmount = totalKm * ratePerKm;
    setResult({ totalKm, totalAmount });
  }, [distance, ratePerKm, trips]);

  const output = JSON.stringify(
    { distanceKm: distance, ratePerKm, trips, totalKm: result.totalKm, totalAmount: result.totalAmount },
    null,
    2
  );

  return (
    <ToolLayout
      title="Mileage Calculator"
      description="Calculate mileage reimbursement for gig drivers (Uber, delivery, etc.). Purpose: Track distance and claim deductions or reimbursement."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="mileage-calculator"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Distance (km) per trip</label>
          <NumberInput value={distance} onChange={setDistance} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Rate per km (₹)</label>
          <NumberInput value={ratePerKm} onChange={setRatePerKm} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          <p className="mt-1 text-xs text-[var(--text-muted)]">Standard deduction ~₹8/km (check local rules)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Number of trips</label>
          <NumberInput value={trips} onChange={setTrips} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">Total distance: {result.totalKm.toFixed(1)} km</p>
          <p className="text-lg font-bold text-[var(--accent)]">Total: ₹{result.totalAmount.toFixed(2)}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
