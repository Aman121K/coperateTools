import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

const WORDS = [
  'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'sed', 'do', 'eiusmod',
  'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore', 'magna', 'aliqua', 'enim', 'ad', 'minim',
  'veniam', 'quis', 'nostrud', 'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea',
  'commodo', 'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate', 'velit',
  'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint', 'occaecat', 'cupidatat',
  'non', 'proident', 'sunt', 'culpa', 'qui', 'officia', 'deserunt', 'mollit', 'anim', 'id', 'est',
];

function randomWord() {
  return WORDS[Math.floor(Math.random() * WORDS.length)];
}

function generateLorem(count: number, type: 'words' | 'sentences' | 'paragraphs'): string {
  if (type === 'words') {
    return Array.from({ length: count }, randomWord).join(' ');
  }
  if (type === 'sentences') {
    const sentences: string[] = [];
    for (let i = 0; i < count; i++) {
      const len = 5 + Math.floor(Math.random() * 10);
      const s = Array.from({ length: len }, randomWord).join(' ');
      sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
    }
    return sentences.join(' ');
  }
  const paragraphs: string[] = [];
  for (let p = 0; p < count; p++) {
    const numSentences = 3 + Math.floor(Math.random() * 4);
    const sentences: string[] = [];
    for (let i = 0; i < numSentences; i++) {
      const len = 5 + Math.floor(Math.random() * 10);
      const s = Array.from({ length: len }, randomWord).join(' ');
      sentences.push(s.charAt(0).toUpperCase() + s.slice(1) + '.');
    }
    paragraphs.push(sentences.join(' '));
  }
  return paragraphs.join('\n\n');
}

export function LoremIpsum() {
  const [type, setType] = useState<'words' | 'sentences' | 'paragraphs'>('paragraphs');
  const [count, setCount] = useState(3);
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const max = type === 'words' ? 500 : type === 'sentences' ? 50 : 10;
    const n = Math.min(count, max);
    setOutput(generateLorem(n, type));
  };

  return (
    <ToolLayout
      title="Lorem Ipsum Generator"
      description="Generate placeholder text. Purpose: Mock content for layouts, wireframes, or design prototypes."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="lorem-ipsum"
      singlePanel
      showCopyMinified={false}
      shareData={{ type, count }}
      onRestoreFromShare={(d) => {
        if (typeof d.type === 'string') setType(d.type as typeof type);
        if (typeof d.count === 'number') setCount(d.count);
      }}
    >
      <div className="space-y-6">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
            >
              <option value="words">Words</option>
              <option value="sentences">Sentences</option>
              <option value="paragraphs">Paragraphs</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">
              Count (max: {type === 'words' ? 500 : type === 'sentences' ? 50 : 10})
            </label>
            <input
              type="number"
              min={1}
              max={type === 'words' ? 500 : type === 'sentences' ? 50 : 10}
              value={count}
              onChange={(e) => setCount(Math.min(type === 'words' ? 500 : type === 'sentences' ? 50 : 10, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-24 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
            />
          </div>
          <button
            type="button"
            onClick={handleGenerate}
            className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
          >
            Generate
          </button>
        </div>
        {output && (
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Output</label>
            <Editor value={output} onChange={() => {}} language="plaintext" height="300px" readOnly />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
