import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'csv-to-json' | 'json-to-csv';
type OutputFormat = 'array' | 'object-keyed' | 'ndjson';

function parseValue(val: string): string | number | boolean | null {
  const v = val.trim();
  if (v === '' || v.toLowerCase() === 'null') return null;
  if (v.toLowerCase() === 'true') return true;
  if (v.toLowerCase() === 'false') return false;
  const num = Number(v);
  if (!Number.isNaN(num) && v !== '') return num;
  return v;
}

function csvToArray(csv: string, hasHeader: boolean, detectTypes: boolean): string {
  const parsed = Papa.parse<string[]>(csv, { skipEmptyLines: true });
  const rows = parsed.data as string[][];
  if (rows.length === 0) return '[]';
  const headers = hasHeader ? rows[0] : rows[0].map((_, i) => `col${i + 1}`);
  const dataRows = hasHeader ? rows.slice(1) : rows;
  const arr = dataRows.map((row) => {
    const obj: Record<string, unknown> = {};
    headers.forEach((h, i) => {
      const val = row[i] ?? '';
      obj[h] = detectTypes ? parseValue(val) : val;
    });
    return obj;
  });
  return JSON.stringify(arr, null, 2);
}

function csvToObjectKeyed(csv: string, keyCol: string, hasHeader: boolean): string {
  const arr = JSON.parse(csvToArray(csv, hasHeader, true));
  const obj: Record<string, unknown> = {};
  for (const row of arr) {
    const key = String((row as Record<string, unknown>)[keyCol] ?? '');
    if (key) obj[key] = row;
  }
  return JSON.stringify(obj, null, 2);
}

function csvToNdjson(csv: string, hasHeader: boolean, detectTypes: boolean): string {
  const arrJson = csvToArray(csv, hasHeader, detectTypes);
  const arr = JSON.parse(arrJson) as Record<string, unknown>[];
  return arr.map((o) => JSON.stringify(o)).join('\n');
}

function jsonToCsv(json: string): string {
  try {
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
  } catch {
    return '';
  }
}

export function CsvJson() {
  const [input, setInput] = useState('name,age,city\nJohn,30,NYC\nJane,25,LA');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('csv-to-json');
  const [hasHeader, setHasHeader] = useState(true);
  const [detectTypes, setDetectTypes] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('array');
  const [keyColumn, setKeyColumn] = useState('id');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (mode === 'json-to-csv') {
        setOutput(jsonToCsv(input));
      } else {
        if (outputFormat === 'array') {
          setOutput(csvToArray(input, hasHeader, detectTypes));
        } else if (outputFormat === 'object-keyed') {
          setOutput(csvToObjectKeyed(input, keyColumn, hasHeader));
        } else {
          setOutput(csvToNdjson(input, hasHeader, detectTypes));
        }
      }
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode, hasHeader, detectTypes, outputFormat, keyColumn]);

  return (
    <ToolLayout
      title="CSV ↔ JSON"
      description="Convert CSV to JSON with header toggle and type detection. Purpose: Parse CSV for APIs or data pipelines."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="csv-json"
      actions={
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          <option value="csv-to-json">CSV → JSON</option>
          <option value="json-to-csv">JSON → CSV</option>
        </select>
      }
    >
      <div className="space-y-4">
        {mode === 'csv-to-json' && (
          <div className="flex flex-wrap gap-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={hasHeader} onChange={(e) => setHasHeader(e.target.checked)} />
              <span className="text-sm">Header row</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={detectTypes} onChange={(e) => setDetectTypes(e.target.checked)} />
              <span className="text-sm">Auto-detect types (number, boolean, null)</span>
            </label>
            <div>
              <label className="block text-xs text-[var(--text-muted)] mb-1">Output</label>
              <select
                value={outputFormat}
                onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
              >
                <option value="array">Array of objects</option>
                <option value="object-keyed">Object keyed by column</option>
                <option value="ndjson">JSON Lines (NDJSON)</option>
              </select>
            </div>
            {outputFormat === 'object-keyed' && (
              <div>
                <label className="block text-xs text-[var(--text-muted)] mb-1">Key column</label>
                <input
                  type="text"
                  value={keyColumn}
                  onChange={(e) => setKeyColumn(e.target.value)}
                  placeholder="id"
                  className="w-24 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                />
              </div>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {mode === 'csv-to-json' ? 'CSV' : 'JSON'}
            </label>
            <Editor value={input} onChange={setInput} language={mode === 'csv-to-json' ? 'plaintext' : 'json'} height="400px" />
            {error && <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              {mode === 'csv-to-json' ? 'JSON' : 'CSV'}
            </label>
            <Editor value={output} onChange={() => {}} language={mode === 'csv-to-json' ? 'json' : 'plaintext'} height="400px" readOnly />
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
