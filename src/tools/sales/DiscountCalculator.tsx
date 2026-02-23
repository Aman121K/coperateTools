import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function DiscountCalculator() {
  const [price, setPrice] = useState(1000);
  const [discount, setDiscount] = useState(20);
  const [result, setResult] = useState({ final: 0, saved: 0 });

  useEffect(() => {
    const saved = price * (discount / 100);
    setResult({ final: price - saved, saved });
  }, [price, discount]);

  return (
    <ToolLayout title="Discount Calculator" description="Calculate final price after discount. Purpose: Apply % or fixed discounts for quotes, promotions, or pricing." input="" output={JSON.stringify(result, null, 2)} onInputChange={() => {}} toolId="discount-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Original Price (₹)</label>
          <NumberInput value={price} onChange={setPrice} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Discount (%)</label>
          <NumberInput value={discount} onChange={setDiscount} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="space-y-2 p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p><span className="text-[var(--text-muted)]">You save:</span> ₹{result.saved.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p className="text-xl font-bold text-[var(--accent)]">Final Price: ₹{result.final.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
