import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

type Mode = 'project-to-hourly' | 'hourly-to-project';

export function ProjectRateCalculator() {
  const [mode, setMode] = useState<Mode>('project-to-hourly');
  const [projectFee, setProjectFee] = useState(5000);
  const [hours, setHours] = useState(10);
  const [hourlyRate, setHourlyRate] = useState(500);
  const [overheadPercent, setOverheadPercent] = useState(25);
  const [result, setResult] = useState({ effectiveHourly: 0, suggestedProject: 0 });

  useEffect(() => {
    if (mode === 'project-to-hourly') {
      const effective = hours > 0 ? projectFee / hours : 0;
      setResult({ effectiveHourly: effective, suggestedProject: 0 });
    } else {
      const withOverhead = hourlyRate * (1 + overheadPercent / 100);
      const suggested = hours > 0 ? withOverhead * hours : 0;
      setResult({ effectiveHourly: 0, suggestedProject: suggested });
    }
  }, [mode, projectFee, hours, hourlyRate, overheadPercent]);

  const output = JSON.stringify(
    mode === 'project-to-hourly'
      ? { projectFee, hours, effectiveHourlyRate: result.effectiveHourly }
      : { hourlyRate, overheadPercent, hours, suggestedProjectFee: result.suggestedProject },
    null,
    2
  );

  return (
    <ToolLayout
      title="Project Rate Calculator"
      description="Convert between project fee and hourly rate. Account for overhead (taxes, benefits). Purpose: Price projects or compare gig offers."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="project-rate-calc"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Calculate</label>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setMode('project-to-hourly')}
              className={`flex-1 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium ${
                mode === 'project-to-hourly' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border)]'
              }`}
            >
              Project → Hourly
            </button>
            <button
              type="button"
              onClick={() => setMode('hourly-to-project')}
              className={`flex-1 px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium ${
                mode === 'hourly-to-project' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border)]'
              }`}
            >
              Hourly → Project
            </button>
          </div>
        </div>
        {mode === 'project-to-hourly' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Project Fee (₹)</label>
              <NumberInput value={projectFee} onChange={setProjectFee} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Hours worked</label>
              <NumberInput value={hours} onChange={setHours} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
            <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
              <p className="text-lg font-bold text-[var(--accent)]">Effective hourly: ₹{result.effectiveHourly.toFixed(2)}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Your hourly rate (₹)</label>
              <NumberInput value={hourlyRate} onChange={setHourlyRate} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Overhead % (taxes, benefits)</label>
              <NumberInput value={overheadPercent} onChange={setOverheadPercent} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Estimated hours</label>
              <NumberInput value={hours} onChange={setHours} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
            </div>
            <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
              <p className="text-lg font-bold text-[var(--accent)]">Suggested project fee: ₹{result.suggestedProject.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
