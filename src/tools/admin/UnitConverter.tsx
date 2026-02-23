import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

const UNITS: Record<string, Record<string, number>> = {
  length: { m: 1, km: 0.001, cm: 100, mm: 1000, mi: 0.000621371, ft: 3.28084, in: 39.3701 },
  weight: { kg: 1, g: 1000, lb: 2.20462, oz: 35.274 },
  temp: { c: 1, f: 1, k: 1 }, // special
  area: { sqm: 1, sqft: 10.7639, acre: 0.000247105, hectare: 0.0001 },
};

export function UnitConverter() {
  const [category, setCategory] = useState<keyof typeof UNITS>('length');
  const [value, setValue] = useState(1);
  const [from, setFrom] = useState('m');
  const [to, setTo] = useState('ft');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (category === 'temp') {
      let c = value;
      if (from === 'f') c = (value - 32) * 5 / 9;
      if (from === 'k') c = value - 273.15;
      let out = c;
      if (to === 'f') out = c * 9 / 5 + 32;
      if (to === 'k') out = c + 273.15;
      setResult(out.toFixed(2));
    } else {
      const units = UNITS[category];
      const base = value / units[from];
      const converted = base * units[to];
      setResult(converted.toFixed(4));
    }
  }, [value, from, to, category]);

  const units = UNITS[category];
  const unitList = Object.keys(units);

  return (
    <ToolLayout title="Unit Converter" description="Convert length, weight, temperature, area. Purpose: Switch between metric/imperial units for calculations or documentation." input="" output={result} onInputChange={() => {}} toolId="unit-converter" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value as keyof typeof UNITS)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
            <option value="length">Length</option>
            <option value="weight">Weight</option>
            <option value="temp">Temperature</option>
            <option value="area">Area</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">From</label>
          <div className="flex gap-2">
            <NumberInput value={value} onChange={setValue} className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-24 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
              {unitList.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">To</label>
          <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
            {unitList.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-xl font-bold text-[var(--accent)]">= {result} {to}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
