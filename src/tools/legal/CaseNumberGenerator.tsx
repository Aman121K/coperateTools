import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function CaseNumberGenerator() {
  const [prefix, setPrefix] = useState('CASE');
  const [year, setYear] = useState(new Date().getFullYear());
  const [start, setStart] = useState(1);
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const generate = () => {
    const ids = Array.from({ length: Math.min(count, 50) }, (_, i) =>
      `${prefix}-${year}-${String(start + i).padStart(4, '0')}`
    );
    setOutput(ids.join('\n'));
  };

  return (
    <ToolLayout title="Case Number Generator" description="Generate legal case reference numbers. Purpose: Create consistent case IDs for filing, tracking, or court submissions." input="" output={output} onInputChange={() => {}} toolId="case-number" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Prefix</label>
            <input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Year</label>
            <input type="number" value={year} onChange={(e) => setYear(parseInt(e.target.value, 10) || 2024)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start #</label>
            <input type="number" value={start} onChange={(e) => setStart(parseInt(e.target.value, 10) || 1)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Count</label>
            <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(parseInt(e.target.value, 10) || 5)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="plaintext" height="128px" readOnly />}
      </div>
    </ToolLayout>
  );
}
