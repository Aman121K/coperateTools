import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

export function AttendanceCalculator() {
  const [checkIn, setCheckIn] = useState('09:00');
  const [checkOut, setCheckOut] = useState('18:00');
  const [breakMinutes, setBreakMinutes] = useState(60);
  const [result, setResult] = useState('');

  useEffect(() => {
    const [inH, inM] = checkIn.split(':').map(Number);
    const [outH, outM] = checkOut.split(':').map(Number);
    let mins = (outH * 60 + outM) - (inH * 60 + inM);
    if (mins < 0) mins += 24 * 60;
    mins -= breakMinutes;
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    setResult(`${h}h ${m}m`);
  }, [checkIn, checkOut, breakMinutes]);

  return (
    <ToolLayout title="Attendance Calculator" description="Calculate work hours. Purpose: Compute total hours worked from clock-in/out for payroll or timesheets." input="" output={result} onInputChange={() => {}} toolId="attendance-calc" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Check In</label>
          <input type="time" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Check Out</label>
          <input type="time" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Break (minutes)</label>
          <NumberInput value={breakMinutes} onChange={setBreakMinutes} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Total Work Hours</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{result}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
