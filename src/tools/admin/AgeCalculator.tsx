import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

export function AgeCalculator() {
  const [dob, setDob] = useState('1990-01-01');
  const [result, setResult] = useState('');
  const [asOf, setAsOf] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    const birth = new Date(dob);
    const end = new Date(asOf);
    if (isNaN(birth.getTime()) || isNaN(end.getTime())) {
      setResult('');
      return;
    }
    let years = end.getFullYear() - birth.getFullYear();
    let months = end.getMonth() - birth.getMonth();
    let days = end.getDate() - birth.getDate();
    if (days < 0) {
      months--;
      days += new Date(end.getFullYear(), end.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }
    const totalDays = Math.floor((end.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    setResult(`${years} years, ${months} months, ${days} days (${totalDays} total days)`);
  }, [dob, asOf]);

  return (
    <ToolLayout title="Age Calculator" description="Calculate exact age in years, months, days. Purpose: Birth records, eligibility, tenure, or personal records." input="" output={result} onInputChange={() => {}} toolId="age-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date of Birth</label>
          <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Calculate age as of</label>
          <input type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        {result && (
          <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <p className="text-lg font-bold text-[var(--accent)]">{result}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
