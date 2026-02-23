import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function PercentageCalculator() {
  const [value, setValue] = useState(100);
  const [percent, setPercent] = useState(20);
  const [mode, setMode] = useState<'of' | 'is' | 'change'>('of');
  const [value2, setValue2] = useState(50);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (mode === 'of') {
      setResult(String((value * percent / 100).toFixed(2)));
    } else if (mode === 'is') {
      setResult(value2 ? String(((value / value2) * 100).toFixed(2)) + '%' : '');
    } else {
      setResult(value2 ? String((((value - value2) / value2) * 100).toFixed(2)) + '%' : '');
    }
  }, [value, percent, mode, value2]);

  return (
    <ToolLayout title="Percentage Calculator" description="Calculate percentage of, what % is, % change. Purpose: Quick percentage math for discounts, margins, growth, or splits." input="" output={result} onInputChange={() => {}} toolId="percentage-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <select value={mode} onChange={(e) => setMode(e.target.value as typeof mode)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
          <option value="of">What is X% of Y?</option>
          <option value="is">X is what % of Y?</option>
          <option value="change">% change from X to Y</option>
        </select>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">{mode === 'of' ? 'Value (Y)' : 'Value (X)'}</label>
          <NumberInput value={value} onChange={setValue} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        {mode === 'of' && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Percentage (X%)</label>
            <NumberInput value={percent} onChange={setPercent} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        )}
        {(mode === 'is' || mode === 'change') && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Value (Y)</label>
            <NumberInput value={value2} onChange={setValue2} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        )}
        {result && (
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <p className="text-xl font-bold text-[var(--accent)]">Result: {result}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
