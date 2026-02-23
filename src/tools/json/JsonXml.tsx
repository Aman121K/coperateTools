import { useState, useEffect } from 'react';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'json-to-xml' | 'xml-to-json';

const parser = new XMLParser({ ignoreAttributes: false });
const builder = new XMLBuilder({ ignoreAttributes: false });

export function JsonXml() {
  const [input, setInput] = useState('{"name":"John","age":30}');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('json-to-xml');
  const [error, setError] = useState('');

  useEffect(() => {
    try {
      if (mode === 'json-to-xml') {
        const parsed = JSON.parse(input);
        const xml = builder.build({ root: parsed });
        setOutput('<?xml version="1.0" encoding="UTF-8"?>\n' + xml);
      } else {
        const result = parser.parse(input);
        setOutput(JSON.stringify(result, null, 2));
      }
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input, mode]);

  return (
    <ToolLayout
      title="JSON ↔ XML"
      description="Convert between JSON and XML. Purpose: Integrate legacy XML APIs or transform SOAP responses."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage={mode === 'json-to-xml' ? 'json' : 'xml'}
      outputLanguage={mode === 'json-to-xml' ? 'xml' : 'json'}
      toolId="json-xml"
      actions={
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as Mode)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          <option value="json-to-xml">JSON → XML</option>
          <option value="xml-to-json">XML → JSON</option>
        </select>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'json-to-xml' ? 'JSON' : 'XML'}
          </label>
          <Editor value={input} onChange={setInput} language={mode === 'json-to-xml' ? 'json' : 'xml'} height="400px" />
          {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {mode === 'json-to-xml' ? 'XML' : 'JSON'}
          </label>
          <Editor value={output} onChange={() => {}} language={mode === 'json-to-xml' ? 'xml' : 'json'} height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
