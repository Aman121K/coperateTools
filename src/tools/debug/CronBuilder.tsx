import { useState, useEffect } from 'react';
import CronExpressionParser from 'cron-parser';
import cronstrue from 'cronstrue';
import { ToolLayout } from '../../components/ToolLayout';

const PRESETS = [
  { label: 'Every minute', value: '* * * * *' },
  { label: 'Every 5 min', value: '*/5 * * * *' },
  { label: 'Every hour', value: '0 * * * *' },
  { label: 'Daily at midnight', value: '0 0 * * *' },
  { label: 'Weekly (Sun 00:00)', value: '0 0 * * 0' },
  { label: 'Monthly (1st)', value: '0 0 1 * *' },
];

export function CronBuilder() {
  const [cron, setCron] = useState('0 0 * * *');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setOutput(cronstrue.toString(cron));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [cron]);

  const nextRuns = () => {
    try {
      const interval = CronExpressionParser.parse(cron);
      const runs: string[] = [];
      for (let i = 0; i < 5; i++) {
        runs.push(interval.next().toDate().toISOString());
      }
      return runs.join('\n');
    } catch {
      return '';
    }
  };

  return (
    <ToolLayout
      title="Cron Expression Builder"
      description="Build and validate cron expressions. Purpose: Schedule jobs, understand cron syntax, or preview next runs."
      input={cron}
      output={output}
      onInputChange={setCron}
      toolId="cron"
      singlePanel
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Cron expression</label>
          <input
            value={cron}
            onChange={(e) => setCron(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] font-mono"
            placeholder="0 0 * * *"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              onClick={() => setCron(p.value)}
              className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] hover:bg-[var(--border)]"
            >
              {p.label}
            </button>
          ))}
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {output && (
          <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="font-medium text-green-400">{output}</p>
          </div>
        )}
        {output && (
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Next 5 runs</label>
            <pre className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm">
              {nextRuns()}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
