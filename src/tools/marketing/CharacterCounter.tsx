import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

const LIMITS = { twitter: 280, linkedin: 3000, meta: 125, sms: 160 };

export function CharacterCounter() {
  const [input, setInput] = useState('');
  const [platform, setPlatform] = useState<keyof typeof LIMITS>('twitter');
  const limit = LIMITS[platform];
  const remaining = limit - input.length;
  const over = remaining < 0;

  return (
    <ToolLayout title="Character Counter" description="Check character limits for social media. Purpose: Stay within Twitter, LinkedIn, or ad limits before posting." input={input} output={String(input.length)} onInputChange={setInput} toolId="character-counter" singlePanel showCopyMinified={false}>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value as keyof typeof LIMITS)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <option value="twitter">Twitter/X (280)</option>
            <option value="linkedin">LinkedIn (3000)</option>
            <option value="meta">Meta/Facebook (125)</option>
            <option value="sms">SMS (160)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Text</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="150px" />
        </div>
        <div className={`p-4 rounded-[var(--radius)] border ${over ? 'bg-red-500/10 border-red-500/30' : 'bg-[var(--accent-muted)] border-[var(--accent)]/30'}`}>
          <p className="text-2xl font-bold">{input.length} / {limit}</p>
          <p className="text-sm text-[var(--text-muted)]">{over ? `${Math.abs(remaining)} over limit` : `${remaining} remaining`}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
