import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function BmiCalculator() {
  const [weight, setWeight] = useState(70);
  const [heightCm, setHeightCm] = useState(170);
  const [result, setResult] = useState<{ bmi: number; category: string } | null>(null);

  useEffect(() => {
    if (heightCm <= 0) return;
    const heightM = heightCm / 100;
    const bmi = weight / (heightM * heightM);
    let category = 'Underweight';
    if (bmi >= 30) category = 'Obese';
    else if (bmi >= 25) category = 'Overweight';
    else if (bmi >= 18.5) category = 'Normal';
    setResult({ bmi, category });
  }, [weight, heightCm]);

  return (
    <ToolLayout title="BMI Calculator" description="Calculate Body Mass Index. Purpose: Health check, fitness goals, or medical assessment." input="" output={result ? JSON.stringify(result, null, 2) : ''} onInputChange={() => {}} toolId="bmi-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Weight (kg)</label>
          <NumberInput value={weight} onChange={setWeight} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Height (cm)</label>
          <NumberInput value={heightCm} onChange={setHeightCm} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        {result && (
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 space-y-2">
            <p className="text-2xl font-bold text-[var(--accent)]">BMI: {result.bmi.toFixed(1)}</p>
            <p className="text-sm text-[var(--text-secondary)]">Category: {result.category}</p>
            <p className="text-xs text-[var(--text-muted)]">Ranges: Underweight &lt;18.5; Normal 18.5–25; Overweight 25–30; Obese ≥30</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
