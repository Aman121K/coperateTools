import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

function jsonToTypeScript(obj: unknown): string {
  if (obj === null) return 'null';
  if (obj === undefined) return 'undefined';
  if (typeof obj === 'boolean') return 'boolean';
  if (typeof obj === 'number') return 'number';
  if (typeof obj === 'string') return 'string';
  if (Array.isArray(obj)) {
    const first = obj[0];
    const itemType = first !== undefined ? jsonToTypeScript(first) : 'unknown';
    return `Array<${itemType}>`;
  }
  if (typeof obj === 'object') {
    const entries = Object.entries(obj as Record<string, unknown>);
    const lines = entries.map(([k, v]) => {
      const optional = v === null || v === undefined ? '?' : '';
      const type = jsonToTypeScript(v);
      return `  ${k}${optional}: ${type};`;
    });
    return `{\n${lines.join('\n')}\n}`;
  }
  return 'unknown';
}

export function JsonToTypes() {
  const [input, setInput] = useState('{"name":"John","age":30,"active":true}');
  const [output, setOutput] = useState('');
  const [typeName, setTypeName] = useState('MyType');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      const parsed = JSON.parse(input);
      const body = jsonToTypeScript(parsed);
      setOutput(`interface ${typeName} ${body}\n`);
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, typeName]);

  return (
    <ToolLayout
      title="JSON → TypeScript"
      description="Generate TypeScript interfaces from JSON. Purpose: Create type definitions from API responses or sample data."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage="json"
      outputLanguage="typescript"
      toolId="json-types"
      actions={
        <input
          type="text"
          value={typeName}
          onChange={(e) => setTypeName(e.target.value || 'MyType')}
          placeholder="Type name"
          className="w-32 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm"
        />
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">JSON</label>
          <Editor value={input} onChange={setInput} language="json" height="400px" />
          {error && <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">TypeScript</label>
          <Editor value={output} onChange={() => {}} language="typescript" height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
