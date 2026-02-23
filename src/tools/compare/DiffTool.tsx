import { useState, useEffect } from 'react';
import { diffWords, diffLines } from 'diff';
import type { Change } from 'diff';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function DiffTool() {
  const [left, setLeft] = useState('Hello World');
  const [right, setRight] = useState('Hello Universe');
  const [mode, setMode] = useState<'words' | 'lines'>('lines');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const diff = mode === 'words' ? diffWords(left, right) : diffLines(left, right);
    const html = diff
      .map((part: Change) => {
        const cls = part.added ? 'bg-green-500/30' : part.removed ? 'bg-red-500/30' : '';
        const prefix = part.added ? '+' : part.removed ? '-' : ' ';
        return `<span class="${cls}">${prefix} ${escapeHtml(part.value)}</span>`;
      })
      .join('');
    setOutput(html);
  }, [left, right, mode]);

  function escapeHtml(s: string) {
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');
  }

  return (
    <ToolLayout
      title="Text Diff"
      description="Compare two texts line-by-line or word-by-word. Purpose: Spot changes in configs, contracts, or code."
      input={left}
      output={right}
      onInputChange={setLeft}
      toolId="diff"
      singlePanel
    >
      <div className="space-y-4">
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as 'words' | 'lines')}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          <option value="lines">Line diff</option>
          <option value="words">Word diff</option>
        </select>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Original</label>
            <Editor value={left} onChange={setLeft} language="plaintext" height="300px" />
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Modified</label>
            <Editor value={right} onChange={setRight} language="plaintext" height="300px" />
          </div>
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">Diff result</label>
          <div
            className="p-4 rounded-lg bg-[var(--bg-tertiary)] border border-[var(--border)] font-mono text-sm whitespace-pre-wrap min-h-[150px]"
            dangerouslySetInnerHTML={{ __html: output }}
          />
        </div>
      </div>
    </ToolLayout>
  );
}
