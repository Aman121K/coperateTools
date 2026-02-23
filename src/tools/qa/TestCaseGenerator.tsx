import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function TestCaseGenerator() {
  const [name, setName] = useState('');
  const [steps, setSteps] = useState('');
  const [expected, setExpected] = useState('');
  const [output, setOutput] = useState('');

  const generate = () => {
    const tc = {
      id: `TC-${Date.now().toString(36).toUpperCase()}`,
      name: name || 'Test case name',
      steps: steps.split('\n').filter(Boolean).map((s, i) => ({ step: i + 1, action: s })),
      expectedResult: expected,
      status: 'Not Run',
    };
    setOutput(JSON.stringify(tc, null, 2));
  };

  return (
    <ToolLayout title="Test Case Generator" description="Generate structured test case. Purpose: Create test cases for QA docs or test management tools." input="" output={output} onInputChange={() => {}} toolId="test-case" singlePanel>
      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Test Case Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Login with valid credentials" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Steps (one per line)</label>
          <Editor value={steps} onChange={setSteps} language="plaintext" height="120px" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Expected Result</label>
          <input value={expected} onChange={(e) => setExpected(e.target.value)} placeholder="User should be logged in" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <button type="button" onClick={generate} className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Generate</button>
        {output && <Editor value={output} onChange={() => {}} language="json" height="192px" readOnly />}
      </div>
    </ToolLayout>
  );
}
