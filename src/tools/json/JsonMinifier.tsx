import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function JsonMinifier() {
  const [input, setInput] = useState('{\n  "name": "John",\n  "age": 30\n}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  return (
    <ToolLayout
      title="JSON Minifier"
      description="Remove whitespace from JSON. Purpose: Shrink payload size for APIs or embed in URLs."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage="json"
      outputLanguage="json"
      toolId="json-minifier"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Input JSON</label>
          <Editor value={input} onChange={setInput} language="json" height="400px" />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Minified Output</label>
          <Editor value={output} onChange={() => {}} language="json" height="400px" readOnly />
          {output && <p className="mt-2 text-xs text-[var(--text-secondary)]">{output.length} chars</p>}
        </div>
      </div>
    </ToolLayout>
  );
}
