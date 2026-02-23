import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function InventoryCalculator() {
  const [opening, setOpening] = useState(100);
  const [purchased, setPurchased] = useState(50);
  const [sold, setSold] = useState(30);
  const [closing, setClosing] = useState(0);

  useEffect(() => {
    setClosing(Math.max(0, opening + purchased - sold));
  }, [opening, purchased, sold]);

  return (
    <ToolLayout title="Inventory Calculator" description="Track stock: opening + purchased - sold. Purpose: Calculate closing inventory for reports or reorder decisions." input="" output={String(closing)} onInputChange={() => {}} toolId="inventory-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Opening Stock</label>
          <NumberInput value={opening} onChange={setOpening} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Purchased</label>
          <NumberInput value={purchased} onChange={setPurchased} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Sold</label>
          <NumberInput value={sold} onChange={setSold} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Closing Stock</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{closing} units</p>
        </div>
      </div>
    </ToolLayout>
  );
}
