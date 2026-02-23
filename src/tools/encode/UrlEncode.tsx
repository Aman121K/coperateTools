import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'encode' | 'decode';

export function UrlEncode() {
  const [input, setInput] = useState('Hello World!');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (mode === 'encode') {
        setOutput(encodeURIComponent(input));
      } else {
        setOutput(decodeURIComponent(input));
      }
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="URL Encode/Decode"
      description="Encode or decode URL-safe strings. Purpose: Fix special characters in query params or decode encoded URLs."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="url-encode"
      actions={
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          <option value="encode">Encode</option>
          <option value="decode">Decode</option>
        </select>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'encode' ? 'Plain text' : 'Encoded URL'}
          </label>
          <Editor value={input} onChange={setInput} language="plaintext" height="400px" />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'encode' ? 'Encoded URL' : 'Plain text'}
          </label>
          <Editor value={output} onChange={() => {}} language="plaintext" height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
