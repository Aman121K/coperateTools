import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'flatten' | 'unflatten';

function flatten(obj: unknown, prefix = ''): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  if (obj === null || obj === undefined) {
    result[prefix || 'value'] = obj;
    return result;
  }
  if (typeof obj !== 'object' || Array.isArray(obj)) {
    result[prefix || 'value'] = obj;
    return result;
  }
  for (const [k, v] of Object.entries(obj)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (v !== null && typeof v === 'object' && !Array.isArray(v)) {
      Object.assign(result, flatten(v, key));
    } else {
      result[key] = v;
    }
  }
  return result;
}

function unflatten(obj: Record<string, unknown>): unknown {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    const parts = key.split('.');
    let current: Record<string, unknown> = result;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      if (!(p in current)) current[p] = {};
      current = current[p] as Record<string, unknown>;
    }
    current[parts[parts.length - 1]] = value;
  }
  return result;
}

export function JsonFlatten() {
  const [input, setInput] = useState('{"user":{"name":"John","age":30}}');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('flatten');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      if (mode === 'flatten') {
        setOutput(JSON.stringify(flatten(parsed), null, 2));
      } else {
        if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
          throw new Error('Unflatten requires an object with dot-notation keys');
        }
        setOutput(JSON.stringify(unflatten(parsed as Record<string, unknown>), null, 2));
      }
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="JSON Flatten / Unflatten"
      description="Convert nested JSON to dot notation and back. Purpose: Flatten configs for env vars or expand flat keys into objects."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage="json"
      outputLanguage="json"
      toolId="json-flatten"
      actions={
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          <option value="flatten">Flatten</option>
          <option value="unflatten">Unflatten</option>
        </select>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {mode === 'flatten' ? 'Nested JSON' : 'Flattened (dot notation)'}
          </label>
          <Editor value={input} onChange={setInput} language="json" height="400px" />
          {error && <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
            {mode === 'flatten' ? 'Flattened output' : 'Nested output'}
          </label>
          <Editor value={output} onChange={() => {}} language="json" height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
