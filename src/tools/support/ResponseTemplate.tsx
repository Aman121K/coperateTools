import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

const TEMPLATES = [
  { id: 'greeting', name: 'Greeting', text: 'Thank you for reaching out.' },
  { id: 'apology', name: 'Apology', text: 'We apologize for the inconvenience.' },
  { id: 'escalating', name: 'Escalating', text: 'I have escalated this to our team. We will get back to you within 24 hours.' },
  { id: 'resolved', name: 'Resolved', text: 'Thank you for your patience. We have resolved this issue.' },
  { id: 'followup', name: 'Follow-up', text: 'Please let us know if you need any further assistance.' },
];

export function ResponseTemplate() {
  const [selected, setSelected] = useState<string[]>([]);
  const [custom, setCustom] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const parts = selected.map((id) => TEMPLATES.find((t) => t.id === id)?.text).filter(Boolean);
    if (custom) parts.push(custom);
    setOutput(parts.join('\n\n'));
  };

  return (
    <ToolLayout title="Response Template" description="Build support response from snippets. Purpose: Compose consistent replies from reusable templates for faster resolution." input="" output={output} onInputChange={() => {}} toolId="response-template" singlePanel showCopyMinified={false}>
      <div className="max-w-lg space-y-4">
        <p className="text-sm text-[var(--text-muted)]">Select snippets to include:</p>
        <div className="space-y-2">
          {TEMPLATES.map((t) => (
            <label key={t.id} className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={selected.includes(t.id)} onChange={(e) => setSelected(e.target.checked ? [...selected, t.id] : selected.filter((x) => x !== t.id))} />
              <div>
                <span className="font-medium">{t.name}</span>
                <p className="text-sm text-[var(--text-muted)]">{t.text}</p>
              </div>
            </label>
          ))}
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Custom text</label>
          <Editor value={custom} onChange={setCustom} language="plaintext" height="80px" />
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="plaintext" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
