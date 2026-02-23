import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function EmployeeIdGenerator() {
  const [prefix, setPrefix] = useState('EMP');
  const [start, setStart] = useState(1);
  const [count, setCount] = useState(10);
  const [digits, setDigits] = useState(4);
  const [output, setOutput] = useState('');

  const generate = () => {
    const ids = Array.from({ length: Math.min(count, 100) }, (_, i) => {
      const num = (start + i).toString().padStart(digits, '0');
      return `${prefix}${num}`;
    });
    setOutput(ids.join('\n'));
  };

  return (
    <ToolLayout title="Employee ID Generator" description="Generate sequential employee IDs. Purpose: Assign unique IDs to new hires for badges, systems, or directories." input="" output={output} onInputChange={() => {}} toolId="employee-id" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Prefix</label>
            <input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" placeholder="EMP" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Digits</label>
            <input type="number" min={1} max={8} value={digits} onChange={(e) => setDigits(parseInt(e.target.value, 10) || 4)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Start #</label>
            <input type="number" value={start} onChange={(e) => setStart(parseInt(e.target.value, 10) || 1)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Count</label>
            <input type="number" min={1} max={100} value={count} onChange={(e) => setCount(parseInt(e.target.value, 10) || 10)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="plaintext" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
