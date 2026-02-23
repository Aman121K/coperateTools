import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function ReleaseNotesGenerator() {
  const [version, setVersion] = useState('1.0.0');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [features, setFeatures] = useState('');
  const [fixes, setFixes] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const notes = {
      version,
      date,
      added: features.split('\n').filter(Boolean),
      fixed: fixes.split('\n').filter(Boolean),
    };
    setOutput(`# Release ${version} (${date})\n\n## ✨ New Features\n${notes.added.map((f) => `- ${f}`).join('\n')}\n\n## 🐛 Bug Fixes\n${notes.fixed.map((f) => `- ${f}`).join('\n')}`);
  };

  return (
    <ToolLayout title="Release Notes Generator" description="Generate release notes from features & fixes. Purpose: Draft release notes for changelogs or customer updates." input="" output={output} onInputChange={() => {}} toolId="release-notes" singlePanel showCopyMinified={false}>
      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Version</label>
            <input value={version} onChange={(e) => setVersion(e.target.value)} placeholder="1.0.0" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">New Features (one per line)</label>
          <Editor value={features} onChange={setFeatures} language="plaintext" height="100px" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Bug Fixes (one per line)</label>
          <Editor value={fixes} onChange={setFixes} language="plaintext" height="100px" />
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="markdown" height="256px" readOnly />}
      </div>
    </ToolLayout>
  );
}
