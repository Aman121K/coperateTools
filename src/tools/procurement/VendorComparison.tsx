import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';
import { NumberInput } from '../../components/NumberInput';

export function VendorComparison() {
  const [vendors, setVendors] = useState([
    { name: 'Vendor A', price: 100, rating: 4.5, delivery: 5 },
    { name: 'Vendor B', price: 120, rating: 4.8, delivery: 3 },
  ]);
  const [output, setOutput] = useState('');

  const addVendor = () => setVendors([...vendors, { name: '', price: 0, rating: 0, delivery: 0 }]);
  const updateVendor = (i: number, f: string, v: string | number) => {
    const next = [...vendors];
    (next[i] as Record<string, unknown>)[f] = v;
    setVendors(next);
  };
  const removeVendor = (i: number) => setVendors(vendors.filter((_, j) => j !== i));

  const compare = () => {
    const cheapest = vendors.reduce((a, b) => (a.price < b.price ? a : b));
    const bestRating = vendors.reduce((a, b) => (a.rating > b.rating ? a : b));
    const fastest = vendors.reduce((a, b) => (a.delivery < b.delivery ? a : b));
    const summary = {
      vendors,
      summary: {
        cheapest: cheapest.name,
        bestRating: bestRating.name,
        fastestDelivery: fastest.name,
      },
    };
    setOutput(JSON.stringify(summary, null, 2));
  };

  return (
    <ToolLayout title="Vendor Comparison" description="Compare vendors by price, rating, delivery. Purpose: Evaluate suppliers side-by-side before selecting one." input="" output={output} onInputChange={() => {}} toolId="vendor-comparison" singlePanel>
      <div className="max-w-2xl space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-[var(--text-secondary)]">Vendors</label>
          <button type="button" onClick={addVendor} className="text-sm text-[var(--accent)] hover:underline">+ Add Vendor</button>
        </div>
        <div className="space-y-4">
          {vendors.map((v, i) => (
            <div key={i} className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <div className="flex justify-between mb-2">
                <input value={v.name} onChange={(e) => updateVendor(i, 'name', e.target.value)} placeholder="Vendor name" className="font-medium px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)]" />
                <button type="button" onClick={() => removeVendor(i)} className="text-[var(--error)]">×</button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Price (₹)</label>
                  <NumberInput value={v.price} onChange={(n) => updateVendor(i, 'price', n)} className="w-full px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)]" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Rating</label>
                  <NumberInput value={v.rating} onChange={(n) => updateVendor(i, 'rating', n)} className="w-full px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)]" />
                </div>
                <div>
                  <label className="text-xs text-[var(--text-muted)]">Delivery (days)</label>
                  <NumberInput value={v.delivery} onChange={(n) => updateVendor(i, 'delivery', n)} className="w-full px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)]" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <button type="button" onClick={compare} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Compare</button>
        {output && <Editor value={output} onChange={() => {}} language="json" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
