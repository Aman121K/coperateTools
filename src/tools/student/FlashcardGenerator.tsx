import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function FlashcardGenerator() {
  const [input, setInput] = useState('Q: What is photosynthesis?\nA: Process by which plants make food using sunlight.');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'json' | 'csv'>('json');

  const parse = () => {
    const lines = input.split('\n').filter((l) => l.trim());
    const cards: { front: string; back: string }[] = [];
    let current: { q?: string; a?: string } = {};
    for (const line of lines) {
      if (line.match(/^Q[.:]\s*/)) {
        if (current.q) cards.push({ front: current.q, back: current.a || '' });
        current = { q: line.replace(/^Q[.:]\s*/, '').trim(), a: '' };
      } else if (line.match(/^A[.:]\s*/)) {
        current.a = (current.a ? current.a + '\n' : '') + line.replace(/^A[.:]\s*/, '').trim();
      } else if (current.q && line.trim()) {
        current.a = (current.a ? current.a + '\n' : '') + line.trim();
      }
    }
    if (current.q) cards.push({ front: current.q, back: (current.a || '').trim() });

    if (format === 'json') {
      setOutput(JSON.stringify(cards, null, 2));
    } else {
      setOutput('front,back\n' + cards.map((c) => `"${c.front.replace(/"/g, '""')}","${c.back.replace(/"/g, '""')}"`).join('\n'));
    }
  };

  return (
    <ToolLayout title="Flashcard Generator" description="Convert Q&A to flashcards (JSON or CSV). Purpose: Turn notes into importable flashcards for Anki or similar apps." input={input} output={output} onInputChange={setInput} toolId="flashcard-generator" singlePanel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Q&A (use Q: and A:)</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="300px" />
          <div className="flex gap-2 mt-2">
            <select value={format} onChange={(e) => setFormat(e.target.value as 'json' | 'csv')} className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
            <button type="button" onClick={parse} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Convert</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Output</label>
          <Editor value={output} onChange={() => {}} language={format === 'json' ? 'json' : 'plaintext'} height="256px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
