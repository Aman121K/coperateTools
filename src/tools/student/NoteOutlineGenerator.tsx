import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function NoteOutlineGenerator() {
  const [input, setInput] = useState('Main topic\n  Subtopic 1\n  Subtopic 2\n    Detail A\n    Detail B\nAnother main topic');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'markdown' | 'json'>('markdown');

  const parse = () => {
    const lines = input.split('\n');
    const outline: { level: number; text: string }[] = [];
    for (const line of lines) {
      const indent = line.search(/\S|$/);
      const level = Math.floor(indent / 2);
      const text = line.trim();
      if (text) outline.push({ level, text });
    }

    if (format === 'markdown') {
      const md = outline.map((o) => '  '.repeat(o.level) + '#'.repeat(o.level + 1) + ' ' + o.text).join('\n');
      setOutput(md);
    } else {
      setOutput(JSON.stringify(outline, null, 2));
    }
  };

  return (
    <ToolLayout title="Note Outline Generator" description="Convert indented text to outline (Markdown or JSON). Purpose: Structure messy notes into clear hierarchies." input={input} output={output} onInputChange={setInput} toolId="note-outline" singlePanel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Indented notes (2 spaces = 1 level)</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="300px" />
          <div className="flex gap-2 mt-2">
            <select value={format} onChange={(e) => setFormat(e.target.value as 'markdown' | 'json')} className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <option value="markdown">Markdown</option>
              <option value="json">JSON</option>
            </select>
            <button type="button" onClick={parse} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Convert</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Outline</label>
          <Editor value={output} onChange={() => {}} language={format === 'json' ? 'json' : 'markdown'} height="256px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
