import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'json-to-yaml' | 'yaml-to-json';

export function JsonYaml() {
  const [input, setInput] = useState('{"name":"John","age":30}');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('json-to-yaml');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (mode === 'json-to-yaml') {
        const parsed = JSON.parse(input);
        setOutput(yaml.dump(parsed, { indent: 2 }));
      } else {
        const parsed = yaml.load(input);
        setOutput(JSON.stringify(parsed, null, 2));
      }
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="JSON ↔ YAML"
      description="Convert between JSON and YAML. Purpose: Switch config formats for Kubernetes, CI, or config files."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage={mode === 'json-to-yaml' ? 'json' : 'yaml'}
      outputLanguage={mode === 'json-to-yaml' ? 'yaml' : 'json'}
      toolId="json-yaml"
      actions={
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          <option value="json-to-yaml">JSON → YAML</option>
          <option value="yaml-to-json">YAML → JSON</option>
        </select>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'json-to-yaml' ? 'JSON' : 'YAML'}
          </label>
          <Editor value={input} onChange={setInput} language={mode === 'json-to-yaml' ? 'json' : 'yaml'} height="400px" />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'json-to-yaml' ? 'YAML' : 'JSON'}
          </label>
          <Editor value={output} onChange={() => {}} language={mode === 'json-to-yaml' ? 'yaml' : 'json'} height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
