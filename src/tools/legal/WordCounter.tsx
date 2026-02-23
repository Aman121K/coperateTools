import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function WordCounter() {
  const [input, setInput] = useState('');
  const [stats, setStats] = useState({ words: 0, chars: 0, charsNoSpaces: 0, lines: 0, paragraphs: 0 });

  useEffect(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const chars = input.length;
    const charsNoSpaces = input.replace(/\s/g, '').length;
    const lines = input ? input.split('\n').length : 0;
    const paragraphs = input.trim() ? input.trim().split(/\n\s*\n/).length : 0;
    setStats({ words, chars, charsNoSpaces, lines, paragraphs });
  }, [input]);

  return (
    <ToolLayout title="Word Counter" description="Count words, characters, lines. Purpose: Meet contract limits, check document length, or track progress on legal drafts." input={input} output={JSON.stringify(stats, null, 2)} onInputChange={setInput} toolId="word-counter" singlePanel showCopyMinified={false}>
      <div className="space-y-4">
        <Editor value={input} onChange={setInput} language="plaintext" height="300px" />
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <p className="text-xs text-[var(--text-muted)]">Words</p>
            <p className="text-2xl font-bold text-[var(--accent)]">{stats.words}</p>
          </div>
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Characters</p>
            <p className="text-2xl font-bold">{stats.chars}</p>
          </div>
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">No spaces</p>
            <p className="text-2xl font-bold">{stats.charsNoSpaces}</p>
          </div>
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Lines</p>
            <p className="text-2xl font-bold">{stats.lines}</p>
          </div>
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Paragraphs</p>
            <p className="text-2xl font-bold">{stats.paragraphs}</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
