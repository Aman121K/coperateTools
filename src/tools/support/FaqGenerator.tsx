import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function FaqGenerator() {
  const [input, setInput] = useState('Q: How do I reset my password?\nA: Click the link below the login form.');
  const [output, setOutput] = useState('');
  const [format, setFormat] = useState<'json' | 'html'>('json');

  const parse = () => {
    const lines = input.split('\n');
    const faqs: { q: string; a: string }[] = [];
    let current: { q?: string; a?: string } = {};
    for (const line of lines) {
      if (line.match(/^Q[.:]\s*/)) {
        if (current.q) faqs.push({ q: current.q, a: (current.a || '').trim() });
        current = { q: line.replace(/^Q[.:]\s*/, '').trim(), a: '' };
      } else if (line.match(/^A[.:]\s*/)) {
        current.a = (current.a ? current.a + '\n' : '') + line.replace(/^A[.:]\s*/, '').trim();
      } else if (current.q && line.trim()) {
        current.a = (current.a ? current.a + '\n' : '') + line.trim();
      }
    }
    if (current.q) faqs.push({ q: current.q, a: (current.a || '').trim() });
    if (format === 'json') {
      setOutput(JSON.stringify(faqs, null, 2));
    } else {
      const html = faqs.map((f) => `<details><summary>${f.q}</summary><p>${f.a}</p></details>`).join('\n');
      setOutput(html);
    }
  };

  return (
    <ToolLayout title="FAQ Generator" description="Convert Q&A text to JSON or HTML. Purpose: Build FAQ sections for websites or help centers from plain text." input={input} output={output} onInputChange={setInput} toolId="faq-generator" singlePanel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Q&A (use Q: and A:)</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="300px" />
          <div className="flex gap-2 mt-2">
            <select value={format} onChange={(e) => setFormat(e.target.value as 'json' | 'html')} className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <option value="json">JSON</option>
              <option value="html">HTML</option>
            </select>
            <button type="button" onClick={parse} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Convert</button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Output</label>
          <Editor value={output} onChange={() => {}} language={format === 'json' ? 'json' : 'html'} height="256px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
