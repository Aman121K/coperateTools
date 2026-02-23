import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function JsonFormatter() {
  const [input, setInput] = useState('{"name":"John","age":30}');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      setOutput(JSON.stringify(parsed, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Pretty-print and format minified JSON. Purpose: Make API responses or config files readable for debugging."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage="json"
      outputLanguage="json"
      toolId="json-formatter"
    >
      <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
        <div className="flex-1 min-h-0 flex flex-col">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 shrink-0">Paste your JSON</label>
          <Editor value={input} onChange={setInput} language="json" height="100%" />
          {error && (
            <p className="mt-2 text-sm text-[var(--error)] flex items-center gap-1 shrink-0">
              <span>⚠</span> {error}
            </p>
          )}
        </div>
        <div className="flex-1 min-h-0 flex flex-col">
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2 shrink-0">Formatted output</label>
          <Editor value={output} onChange={() => {}} language="json" height="100%" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
