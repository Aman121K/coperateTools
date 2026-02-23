import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function BugReportTemplate() {
  const [title, setTitle] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [actual, setActual] = useState('');
  const [env, setEnv] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const bug = {
      title: title || 'Bug title',
      description: {
        stepsToReproduce: steps.split('\n').filter(Boolean),
        expectedResult: expected,
        actualResult: actual,
      },
      environment: env || 'N/A',
      severity: 'Medium',
      status: 'Open',
    };
    setOutput(JSON.stringify(bug, null, 2));
  };

  return (
    <ToolLayout title="Bug Report Template" description="Generate structured bug report. Purpose: Document bugs consistently for dev teams or issue trackers." input="" output={output} onInputChange={() => {}} toolId="bug-report" singlePanel>
      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief bug description" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Steps to Reproduce</label>
          <Editor value={steps} onChange={setSteps} language="plaintext" height="100px" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Expected Result</label>
          <input value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="What should happen" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Actual Result</label>
          <input value={actual} onChange={(e) => setActual(e.target.value)} placeholder="What actually happens" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Environment</label>
          <input value={env} onChange={(e) => setEnv(e.target.value)} placeholder="Browser, OS, etc." className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="json" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
