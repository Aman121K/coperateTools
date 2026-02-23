import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

type GradeItem = { subject: string; grade: string; credits: number };

const GRADE_POINTS: Record<string, number> = {
  'A+': 4.0, A: 4.0, 'A-': 3.7, 'B+': 3.3, B: 3.0, 'B-': 2.7,
  'C+': 2.3, C: 2.0, 'C-': 1.7, 'D+': 1.3, D: 1.0, F: 0,
};

export function GpaCalculator() {
  const [items, setItems] = useState<GradeItem[]>([{ subject: 'Subject 1', grade: 'A', credits: 3 }]);
  const [gpa, setGpa] = useState(0);

  const addItem = () => setItems([...items, { subject: '', grade: 'A', credits: 3 }]);
  const updateItem = (i: number, f: keyof GradeItem, v: string | number) => {
    const next = [...items];
    (next[i] as Record<string, unknown>)[f] = v;
    setItems(next);
  };
  const removeItem = (i: number) => setItems(items.filter((_, j) => j !== i));

  const calculate = () => {
    let totalPoints = 0;
    let totalCredits = 0;
    items.forEach((item) => {
      const pts = GRADE_POINTS[item.grade] ?? 0;
      totalPoints += pts * item.credits;
      totalCredits += item.credits;
    });
    setGpa(totalCredits > 0 ? totalPoints / totalCredits : 0);
  };

  return (
    <ToolLayout title="GPA Calculator" description="Calculate GPA from grades and credits. Purpose: Academic records, semester grades, or transcript verification." input="" output={String(gpa.toFixed(2))} onInputChange={() => {}} toolId="gpa-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-2xl space-y-4">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium text-[var(--text-secondary)]">Subjects</label>
            <button type="button" onClick={addItem} className="text-sm text-[var(--accent)] hover:underline">+ Add</button>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input value={item.subject} onChange={(e) => updateItem(i, 'subject', e.target.value)} placeholder="Subject" className="flex-1 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] text-sm" />
                <select value={item.grade} onChange={(e) => updateItem(i, 'grade', e.target.value)} className="w-24 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] text-sm">
                  {Object.keys(GRADE_POINTS).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <NumberInput value={item.credits} onChange={(n) => updateItem(i, 'credits', n)} placeholder="Credits" className="w-20 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] text-sm" />
                <button type="button" onClick={() => removeItem(i)} className="text-[var(--error)]">×</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={calculate} className="mt-3 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm">Calculate GPA</button>
        </div>
        {gpa > 0 && (
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <p className="text-2xl font-bold text-[var(--accent)]">GPA: {gpa.toFixed(2)}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
