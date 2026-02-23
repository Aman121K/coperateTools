import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type CaseType = 'camel' | 'pascal' | 'snake' | 'kebab' | 'constant' | 'title';

function toCase(text: string, type: CaseType): string {
  const words = text
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[\s_-]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.toLowerCase());

  if (words.length === 0) return '';

  switch (type) {
    case 'camel':
      return words[0] + words.slice(1).map((w) => w[0].toUpperCase() + w.slice(1)).join('');
    case 'pascal':
      return words.map((w) => w[0].toUpperCase() + w.slice(1)).join('');
    case 'snake':
      return words.join('_');
    case 'kebab':
      return words.join('-');
    case 'constant':
      return words.join('_').toUpperCase();
    case 'title':
      return words.map((w) => w[0].toUpperCase() + w.slice(1)).join(' ');
    default:
      return text;
  }
}

export function CaseConverter() {
  const [input, setInput] = useState('helloWorld');
  const [output, setOutput] = useState('');
  const [caseType, setCaseType] = useState<CaseType>('snake');

  useEffect(() => {
    setOutput(toCase(input, caseType));
  }, [input, caseType]);

  const cases: { value: CaseType; label: string }[] = [
    { value: 'camel', label: 'camelCase' },
    { value: 'pascal', label: 'PascalCase' },
    { value: 'snake', label: 'snake_case' },
    { value: 'kebab', label: 'kebab-case' },
    { value: 'constant', label: 'CONSTANT_CASE' },
    { value: 'title', label: 'Title Case' },
  ];

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between naming conventions. Purpose: Variable names, API keys, file names, or CSS classes."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="case-converter"
      showCopyMinified={false}
      shareData={{ input, caseType }}
      onRestoreFromShare={(d) => {
        if (typeof d.input === 'string') setInput(d.input);
        if (typeof d.caseType === 'string') setCaseType(d.caseType as CaseType);
      }}
      actions={
        <select
          value={caseType}
          onChange={(e) => setCaseType(e.target.value as CaseType)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          {cases.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Input</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="200px" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Output ({cases.find((c) => c.value === caseType)?.label})</label>
          <Editor value={output} onChange={() => {}} language="plaintext" height="200px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
