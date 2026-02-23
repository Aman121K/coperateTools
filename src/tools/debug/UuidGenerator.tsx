import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { nanoid } from 'nanoid';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type GenType = 'uuid' | 'nanoid';

export function UuidGenerator() {
  const [type, setType] = useState<GenType>('uuid');
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const generate = () => {
    const lines: string[] = [];
    for (let i = 0; i < Math.min(count, 100); i++) {
      lines.push(type === 'uuid' ? uuidv4() : nanoid());
    }
    setOutput(lines.join('\n'));
  };

  return (
    <ToolLayout
      title="UUID / NanoID Generator"
      description="Generate unique identifiers in bulk. Purpose: Create UUIDs for DB records, APIs, or distributed systems."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="uuid"
      singlePanel
      showCopyMinified={false}
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as GenType)}
              className="px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
            >
              <option value="uuid">UUID v4</option>
              <option value="nanoid">NanoID</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Count</label>
            <input
              type="number"
              min={1}
              max={100}
              value={count}
              onChange={(e) => setCount(Math.min(100, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-24 px-4 py-2.5 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
            />
          </div>
          <div className="self-end">
            <button
              type="button"
              onClick={generate}
              className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
            >
              Generate
            </button>
          </div>
        </div>
        {output && (
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Generated</label>
            <Editor value={output} onChange={() => {}} language="plaintext" height="300px" readOnly />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
