import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Lang = 'fetch' | 'axios' | 'node' | 'python' | 'go' | 'php';

function parseCurl(curl: string): { url: string; method: string; headers: Record<string, string>; body?: string } {
  const normalized = curl.replace(/\\\s*\n\s*/g, ' ').trim();
  let url = '';
  let method = 'GET';
  const headers: Record<string, string> = {};
  let body = '';

  const urlMatch = normalized.match(/(https?:\/\/[^\s'"]+)/);
  if (urlMatch) url = urlMatch[1];

  const methodMatch = normalized.match(/-X\s+(\w+)|--request\s+(\w+)/i);
  if (methodMatch) method = (methodMatch[1] ?? methodMatch[2] ?? 'GET').toUpperCase();

  const headerMatches = normalized.matchAll(/-H\s+['"]([^'"]+)['"]|--header\s+['"]([^'"]+)['"]/gi);
  for (const m of headerMatches) {
    const h = (m[1] ?? m[2] ?? '').trim();
    const colon = h.indexOf(':');
    if (colon > 0) headers[h.slice(0, colon).trim()] = h.slice(colon + 1).trim();
  }

  const dataMatch = normalized.match(/-d\s+'([^']*)'|--data\s+'([^']*)'|--data-raw\s+'([^']*)'|-d\s+"((?:[^"\\]|\\.)*)"|--data\s+"((?:[^"\\]|\\.)*)"/i);
  if (dataMatch) body = (dataMatch[1] ?? dataMatch[2] ?? dataMatch[3] ?? dataMatch[4] ?? dataMatch[5] ?? '').trim();

  return { url, method, headers, body: body || undefined };
}

function generateCode(curl: string, lang: Lang): string {
  const { url, method, headers, body } = parseCurl(curl);
  if (!url) return '';

  const headersEntries = Object.entries(headers);

  switch (lang) {
    case 'fetch': {
      const headersStr = headersEntries.map(([k, v]) => `  '${k}': '${v}'`).join(',\n');
      let code = `fetch('${url}', {\n  method: '${method}'`;
      if (headersEntries.length) code += `,\n  headers: {\n${headersStr}\n  }`;
      if (body) code += `,\n  body: ${JSON.stringify(body)}`;
      return code + '\n})';
    }
    case 'axios': {
      const headersStr = headersEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n');
      let code = `axios.${method.toLowerCase()}(\n  '${url}'`;
      if (headersEntries.length || body) {
        code += ',\n  ' + (body ? `{\n    data: ${JSON.stringify(body)}` : '{');
        if (headersEntries.length) code += (body ? ',' : '') + `\n    headers: {\n${headersStr}\n    }`;
        code += '\n  }';
      }
      return code + '\n)';
    }
    case 'node': {
      const headersStr = headersEntries.map(([k, v]) => `  '${k}': '${v}'`).join(',\n');
      let code = `const res = await fetch('${url}', {\n  method: '${method}'`;
      if (headersEntries.length) code += `,\n  headers: {\n${headersStr}\n  }`;
      if (body) code += `,\n  body: ${JSON.stringify(body)}`;
      return code + '\n});\nconst data = await res.json();';
    }
    case 'python': {
      const headersStr = headersEntries.map(([k, v]) => `    '${k}': '${v}'`).join(',\n');
      let code = `import requests\n\nresponse = requests.${method.toLowerCase()}('${url}'`;
      if (headersEntries.length) code += ',\n    headers={\n' + headersStr + '\n    }';
      if (body) code += ',\n    data=' + JSON.stringify(body);
      return code + '\n)';
    }
    case 'go': {
      const headersStr = headersEntries.map(([k, v]) => `\treq.Header.Set("${k}", "${v}")`).join('\n');
      const bodyArg = body ? `strings.NewReader(\`${body.replace(/`/g, '\\`')}\`)` : 'nil';
      const imports = body ? 'import (\n\t"net/http"\n\t"strings"\n)\n\n' : 'import "net/http"\n\n';
      let code = imports + `req, _ := http.NewRequest("${method}", "${url}", ${bodyArg})\n`;
      if (headersEntries.length) code += headersStr + '\n';
      return code + 'resp, _ := http.DefaultClient.Do(req)\ndefer resp.Body.Close()';
    }
    case 'php': {
      const headersStr = headersEntries.map(([k, v]) => `  "${k}: ${v}"`).join(",\n");
      let code = `$ch = curl_init('${url}');\ncurl_setopt($ch, CURLOPT_CUSTOMREQUEST, '${method}');`;
      if (headersEntries.length) code += `\ncurl_setopt($ch, CURLOPT_HTTPHEADER, [\n${headersStr}\n]);`;
      if (body) code += `\ncurl_setopt($ch, CURLOPT_POSTFIELDS, '${body.replace(/'/g, "\\'")}');`;
      return code + '\n$response = curl_exec($ch);\ncurl_close($ch);';
    }
    default:
      return '';
  }
}

const LANG_OPTIONS: { value: Lang; label: string }[] = [
  { value: 'fetch', label: 'JavaScript (Fetch)' },
  { value: 'axios', label: 'JavaScript (Axios)' },
  { value: 'node', label: 'Node.js' },
  { value: 'python', label: 'Python' },
  { value: 'go', label: 'Go' },
  { value: 'php', label: 'PHP' },
];

export function CurlConverter() {
  const [input, setInput] = useState(`curl -X POST https://api.example.com/users \\
  -H 'Content-Type: application/json' \\
  -d '{"name":"John"}'`);
  const [output, setOutput] = useState('');
  const [lang, setLang] = useState<Lang>('fetch');

  useEffect(() => {
    const code = generateCode(input, lang);
    setOutput(code);
  }, [input, lang]);

  return (
    <ToolLayout
      title="cURL → Code"
      description="Convert cURL commands to fetch, axios, Python, Go, PHP. Purpose: Reuse browser/Postman requests in your code quickly."
      input={input}
      output={output}
      onInputChange={setInput}
      inputLanguage="bash"
      outputLanguage="javascript"
      toolId="curl"
      shareData={{ input, lang }}
      onRestoreFromShare={(d) => {
        if (typeof d.input === 'string') setInput(d.input);
        if (typeof d.lang === 'string') setLang(d.lang as Lang);
      }}
      actions={
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)]"
        >
          {LANG_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">cURL command</label>
          <Editor value={input} onChange={setInput} language="bash" height="400px" />
        </div>
        <div>
          <label className="block text-sm text-[var(--text-secondary)] mb-2">
            {LANG_OPTIONS.find((o) => o.value === lang)?.label ?? lang} code
          </label>
          <Editor value={output} onChange={() => {}} language="javascript" height="400px" readOnly />
        </div>
      </div>
    </ToolLayout>
  );
}
