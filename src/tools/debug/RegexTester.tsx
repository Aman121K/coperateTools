import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function RegexTester() {
  const [pattern, setPattern] = useState('[a-z]+');
  const [flags, setFlags] = useState('g');
  const [input, setInput] = useState('hello world 123');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const re = new RegExp(pattern, flags);
      const matches = [...input.matchAll(re)];
      if (matches.length === 0) {
        setOutput('No matches found');
      } else {
        setOutput(
          matches
            .map((m, i) => `Match ${i + 1}: "${m[0]}" at index ${m.index}`)
            .join('\n')
        );
      }
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [pattern, flags, input]);

  return (
    <ToolLayout
      title="Regex Tester"
      description="Test regex patterns against sample text. Purpose: Debug patterns before using in code or validation."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="regex"
      singlePanel
    >
      <div className="space-y-4">
        <div className="flex gap-2 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Pattern</label>
            <input
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] font-mono"
              placeholder="[a-z]+"
            />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-1">Flags</label>
            <input
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="w-20 px-3 py-2 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] font-mono"
              placeholder="g"
            />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Test string</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="150px" />
        </div>
        {output && (
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Matches</label>
            <Editor value={output} onChange={() => {}} language="plaintext" height="200px" readOnly />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
