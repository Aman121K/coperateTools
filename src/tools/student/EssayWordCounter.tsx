import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';
import { Editor } from '../../components/Editor';

export function EssayWordCounter() {
  const [input, setInput] = useState('');
  const [target, setTarget] = useState(500);
  const [stats, setStats] = useState({ words: 0, chars: 0, paragraphs: 0, readingMins: 0 });

  useEffect(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const chars = input.length;
    const paragraphs = input.trim() ? input.trim().split(/\n\s*\n/).length : 0;
    const readingMins = Math.ceil(words / 200);
    setStats({ words, chars, paragraphs, readingMins });
  }, [input]);

  const progress = target > 0 ? Math.min(100, (stats.words / target) * 100) : 0;

  return (
    <ToolLayout title="Essay Word Counter" description="Track word count for essays & assignments. Purpose: Meet essay length requirements and monitor progress." input={input} output={JSON.stringify(stats, null, 2)} onInputChange={setInput} toolId="word-counter-student" singlePanel showCopyMinified={false}>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Target words</label>
          <NumberInput value={target} onChange={setTarget} className="w-32 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <Editor value={input} onChange={setInput} language="plaintext" height="250px" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-4 rounded-[var(--radius)] border ${stats.words >= target ? 'bg-[var(--success)]/10 border-[var(--success)]/30' : 'bg-[var(--accent-muted)] border-[var(--accent)]/30'}`}>
            <p className="text-xs text-[var(--text-muted)]">Words</p>
            <p className="text-2xl font-bold">{stats.words} / {target}</p>
          </div>
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Characters</p>
            <p className="text-2xl font-bold">{stats.chars}</p>
          </div>
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">Paragraphs</p>
            <p className="text-2xl font-bold">{stats.paragraphs}</p>
          </div>
          <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <p className="text-xs text-[var(--text-muted)]">~Reading time</p>
            <p className="text-2xl font-bold">{stats.readingMins} min</p>
          </div>
        </div>
        {target > 0 && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
              <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
