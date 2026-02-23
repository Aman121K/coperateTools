import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function JsonValidator() {
  const [input, setInput] = useState('{"name":"John"}');
  const [error, setError] = useState<{ message: string; line?: number; column?: number } | null>(null);

  useEffect(() => {
    try {
      JSON.parse(input);
      setError(null);
    } catch (e) {
      const err = e as Error;
      const match = err.message.match(/position (\d+)/);
      const pos = match ? parseInt(match[1], 10) : 0;
      const lines = input.slice(0, pos).split('\n');
      setError({
        message: err.message,
        line: lines.length,
        column: lines[lines.length - 1]?.length ?? 0,
      });
    }
  }, [input]);

  return (
    <ToolLayout
      title="JSON Validator"
      description="Validate JSON syntax and find errors. Purpose: Fix malformed JSON from APIs or configs before parsing."
      input={input}
      output={error ? `Error at line ${error.line}, col ${error.column}:\n${error.message}` : '✓ Valid JSON'}
      onInputChange={setInput}
      inputLanguage="json"
      outputLanguage="plaintext"
      toolId="json-validator"
      singlePanel
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">JSON to validate</label>
          <Editor value={input} onChange={setInput} language="json" height="400px" />
        </div>
        <div
          className={`p-4 rounded-lg ${
            error ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-green-500/10 border border-green-500/30 text-green-400'
          }`}
        >
          {error ? (
            <pre className="text-sm whitespace-pre-wrap">
              Line {error.line}, Column {error.column}: {error.message}
            </pre>
          ) : (
            <p className="font-medium">✓ Valid JSON</p>
          )}
        </div>
      </div>
    </ToolLayout>
  );
}
