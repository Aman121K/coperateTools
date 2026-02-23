import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function JwtDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const token = input.trim();
    if (!token) {
      setOutput('');
      setError('');
      return;
    }
    try {
      const parts = token.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format (expected 3 parts)');
      const header = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const exp = payload.exp ? new Date(payload.exp * 1000) : null;
      const iat = payload.iat ? new Date(payload.iat * 1000) : null;
      const result = {
        header,
        payload: {
          ...payload,
          exp: exp ? `${exp.toISOString()} ${exp < new Date() ? '(expired)' : ''}` : undefined,
          iat: iat ? iat.toISOString() : undefined,
        },
      };
      setOutput(JSON.stringify(result, null, 2));
      setError('');
    } catch (e) {
      setError((e as Error).message);
      setOutput('');
    }
  }, [input]);

  return (
    <ToolLayout
      title="JWT Decoder"
      description="Decode and inspect JWT tokens. Purpose: Debug auth tokens, verify claims, or check expiry during development."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="jwt"
      singlePanel
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Paste your JWT token</label>
          <Editor value={input} onChange={setInput} language="plaintext" height="120px" />
          {error && (
            <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>
          )}
        </div>
        {output && (
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Decoded (Header + Payload)</label>
            <Editor value={output} onChange={() => {}} language="json" height="400px" readOnly />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
