import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';
import { Editor } from '../../components/Editor';

export function PurchaseOrderGenerator() {
  const [poNumber, setPoNumber] = useState(`PO-${Date.now().toString(36).toUpperCase()}`);
  const [vendor, setVendor] = useState('Vendor Name');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [items, setItems] = useState([{ name: 'Item 1', qty: 10, rate: 100 }]);
  const [output, setOutput] = useState('');

  const addItem = () => setItems([...items, { name: '', qty: 1, rate: 0 }]);
  const updateItem = (i: number, f: string, v: string | number) => {
    const next = [...items];
    (next[i] as Record<string, unknown>)[f] = v;
    setItems(next);
  };
  const removeItem = (i: number) => setItems(items.filter((_, j) => j !== i));

  const generate = () => {
    const total = items.reduce((s, i) => s + i.qty * i.rate, 0);
    const po = {
      poNumber,
      vendor,
      date,
      items: items.map((i) => ({ ...i, amount: i.qty * i.rate })),
      total,
    };
    setOutput(JSON.stringify(po, null, 2));
  };

  return (
    <ToolLayout title="Purchase Order Generator" description="Generate PO data. Purpose: Create purchase order data for vendors, ERP, or procurement workflows." input="" output={output} onInputChange={() => {}} toolId="po-generator" singlePanel>
      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">PO Number</label>
            <input value={poNumber} onChange={(e) => setPoNumber(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Vendor</label>
            <input value={vendor} onChange={(e) => setVendor(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-48 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Items</label>
            <button type="button" onClick={addItem} className="text-sm text-[var(--accent)] hover:underline">+ Add</button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={item.name} onChange={(e) => updateItem(i, 'name', e.target.value)} placeholder="Item" className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" />
                <NumberInput value={item.qty} onChange={(n) => updateItem(i, 'qty', n)} placeholder="Qty" className="w-20 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" />
                <NumberInput value={item.rate} onChange={(n) => updateItem(i, 'rate', n)} placeholder="Rate" className="w-24 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm" />
                <button type="button" onClick={() => removeItem(i)} className="text-[var(--error)]">×</button>
              </div>
            ))}
          </div>
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="json" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
