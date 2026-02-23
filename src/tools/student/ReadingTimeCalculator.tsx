import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

const WPM = 200; // average reading speed

export function ReadingTimeCalculator() {
  const [input, setInput] = useState('');
  const [customWpm, setCustomWpm] = useState(WPM);
  const [result, setResult] = useState({ words: 0, minutes: 0, formatted: '' });

  useEffect(() => {
    const words = input.trim() ? input.trim().split(/\s+/).length : 0;
    const minutes = Math.ceil(words / customWpm);
    const formatted = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${minutes % 60} min`;
    setResult({ words, minutes, formatted });
  }, [input, customWpm]);

  return (
    <ToolLayout title="Reading Time Calculator" description="Estimate reading time (words per minute). Purpose: Plan reading sessions or know how long an article will take." input={input} output={result.formatted} onInputChange={setInput} toolId="reading-time" singlePanel showCopyMinified={false}>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Words per minute</label>
          <input type="number" value={customWpm} onChange={(e) => setCustomWpm(parseInt(e.target.value, 10) || 200)} className="w-32 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Paste text or article</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="250px" />
        </div>
        <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Estimated reading time</p>
          <p className="text-3xl font-bold text-[var(--accent)]">{result.formatted || '0 min'}</p>
          <p className="text-sm text-[var(--text-muted)] mt-1">{result.words} words</p>
        </div>
      </div>
    </ToolLayout>
  );
}
