import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

function jsonToCsv(json: string): string {
  const arr = JSON.parse(json);
  if (!Array.isArray(arr) || arr.length === 0) return '';
  const headers = Object.keys(arr[0] as object);
  const lines = [headers.join(',')];
  for (const row of arr) {
    const values = headers.map((h) => {
      const v = (row as Record<string, unknown>)[h];
      const s = v === null || v === undefined ? '' : String(v);
      return s.includes(',') || s.includes('"') || s.includes('\n') ? `"${s.replace(/"/g, '""')}"` : s;
    });
    lines.push(values.join(','));
  }
  return lines.join('\n');
}

export function JsonToCsv() {
  const [input, setInput] = useState('[{"name":"John","age":30},{"name":"Jane","age":25}]');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      setOutput(jsonToCsv(input));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  return (
    <ToolLayout
      title="JSON → CSV"
      description="Convert JSON array of objects to CSV. Purpose: Export API data to Excel or import into spreadsheets."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage="json"
      outputLanguage="plaintext"
      toolId="json-csv"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">JSON array</label>
          <Editor value={input} onChange={setInput} language="json" height="400px" />
          {error && <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">CSV output</label>
          <Editor value={output} onChange={() => {}} language="plaintext" height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
