import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'encode' | 'decode';

export function Base64() {
  const [input, setInput] = useState('Hello World');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (mode === 'encode') {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="Base64 Encode/Decode"
      description="Encode or decode Base64 strings. Purpose: Embed binary in JSON, decode auth tokens, or handle data URLs."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="base64"
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
            {mode === 'encode' ? 'Plain text' : 'Base64'}
          </label>
          <Editor value={input} onChange={setInput} language="plaintext" height="400px" />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'encode' ? 'Base64' : 'Plain text'}
          </label>
          <Editor value={output} onChange={() => {}} language="plaintext" height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
