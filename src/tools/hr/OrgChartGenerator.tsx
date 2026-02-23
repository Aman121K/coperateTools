import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

function getIndent(line: string): number {
  return line.search(/\S|$/);
}

function parseTree(lines: string[], baseIndent = 0): { name: string; children: unknown[] }[] {
  const result: { name: string; children: unknown[] }[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const indent = getIndent(line);
    const name = line.replace(/^[\s├└│─]*/, '').trim();
    if (!name) {
      i++;
      continue;
    }
    if (indent < baseIndent && result.length > 0) break;
    const node: { name: string; children: unknown[] } = { name, children: [] };
    i++;
    const childLines: string[] = [];
    while (i < lines.length && getIndent(lines[i]) > indent) {
      childLines.push(lines[i]);
      i++;
    }
    node.children = parseTree(childLines, indent);
    result.push(node);
  }
  return result;
}

export function OrgChartGenerator() {
  const [input, setInput] = useState(`CEO
├── CTO
│   ├── Dev Lead
│   └── QA Lead
├── CFO
└── COO`);
  const [output, setOutput] = useState('');

  const parseToJson = () => {
    const lines = input.split('\n');
    const tree = parseTree(lines);
    const result = tree.length === 1 ? tree[0] : { name: 'Root', children: tree };
    setOutput(JSON.stringify(result, null, 2));
  };

  return (
    <ToolLayout title="Org Chart Generator" description="Convert tree text to JSON structure. Purpose: Turn org hierarchy into structured data for charts or HR systems." input={input} output={output} onInputChange={setInput} toolId="org-chart" singlePanel>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Tree format (use ├── and └──)</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="350px" />
          <button type="button" onClick={parseToJson} className="mt-2 px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white">Convert to JSON</button>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">JSON output</label>
          <Editor value={output} onChange={() => {}} language="json" height="256px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
