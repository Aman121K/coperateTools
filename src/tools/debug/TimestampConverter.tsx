import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'to-date' | 'to-timestamp';

export function TimestampConverter() {
  const [mode, setMode] = useState<Mode>('to-date');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'to-date') {
        const ts = input.trim();
        const num = ts.length <= 10 ? parseInt(ts, 10) * 1000 : parseInt(ts, 10);
        if (isNaN(num)) throw new Error('Invalid number');
        const d = new Date(num);
        if (isNaN(d.getTime())) throw new Error('Invalid timestamp');
        setOutput(d.toISOString() + '\n' + d.toLocaleString());
      } else {
        const d = new Date(input.trim());
        if (isNaN(d.getTime())) throw new Error('Invalid date');
        setOutput(String(Math.floor(d.getTime() / 1000)) + '\n' + String(d.getTime()));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid input');
      setOutput('');
    }
  }, [input, mode]);

  const now = () => {
    const ts = Math.floor(Date.now() / 1000);
    setInput(String(ts));
    setMode('to-date');
  };

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert Unix timestamp ↔ human date. Purpose: Debug API responses, log parsing, or cron scheduling."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="timestamp"
      showCopyMinified={false}
      shareData={{ mode, input }}
      onRestoreFromShare={(d) => {
        if (typeof d.mode === 'string') setMode(d.mode as Mode);
        if (typeof d.input === 'string') setInput(d.input);
      }}
      actions={
        <div className="flex gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
          >
            <option value="to-date">Timestamp → Date</option>
            <option value="to-timestamp">Date → Timestamp</option>
          </select>
          <button
            type="button"
            onClick={now}
            className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] hover:bg-[var(--border)]"
          >
            Now
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'to-date' ? 'Unix timestamp (seconds or ms)' : 'Date (ISO, locale, or natural)'}
          </label>
          <Editor value={input} onChange={setInput} language="plaintext" height="200px" />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Result</label>
          <Editor value={output} onChange={() => {}} language="plaintext" height="200px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
