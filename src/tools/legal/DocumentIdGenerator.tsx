import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function DocumentIdGenerator() {
  const [prefix, setPrefix] = useState('DOC');
  const [count, setCount] = useState(5);
  const [output, setOutput] = useState('');

  const generate = () => {
    const ids = Array.from({ length: Math.min(count, 50) }, (_, i) =>
      `${prefix}-${Date.now().toString(36).toUpperCase()}-${String(i + 1).padStart(4, '0')}`
    );
    setOutput(ids.join('\n'));
  };

  return (
    <ToolLayout title="Document ID Generator" description="Generate unique document reference IDs. Purpose: Assign traceable IDs to contracts, filings, or legal documents." input="" output={output} onInputChange={() => {}} toolId="document-id" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Prefix</label>
            <input value={prefix} onChange={(e) => setPrefix(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
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
