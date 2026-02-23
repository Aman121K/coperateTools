import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

async function hash(algo: string, text: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(text);
  const buf = await crypto.subtle.digest(algo, data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export function HashGenerator() {
  const [input, setInput] = useState('Hello World');
  const [output, setOutput] = useState('');
  const [algo, setAlgo] = useState<'SHA-1' | 'SHA-256' | 'SHA-384' | 'SHA-512'>('SHA-256');

  useEffect(() => {
    if (!input) {
      setOutput('');
      return;
    }
    hash(algo, input).then(setOutput).catch(() => setOutput('Error'));
  }, [input, algo]);

  return (
    <ToolLayout
      title="Hash Generator"
      description="Generate SHA-1, SHA-256, SHA-384, SHA-512 hashes. Purpose: Verify file integrity, hash passwords, or checksums."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="hash"
      actions={
        <select
          value={algo}
          onChange={(e) => setAlgo(e.target.value as typeof algo)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          <option value="SHA-1">SHA-1</option>
          <option value="SHA-256">SHA-256</option>
          <option value="SHA-384">SHA-384</option>
          <option value="SHA-512">SHA-512</option>
        </select>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Input</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="400px" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">{algo} Hash</label>
          <Editor value={output} onChange={() => {}} language="plaintext" height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
