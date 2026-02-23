import { useState, useCallback } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

const CHARS = {
  lower: 'abcdefghijklmnopqrstuvwxyz',
  upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  digits: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

function generatePassword(len: number, opts: { lower: boolean; upper: boolean; digits: boolean; symbols: boolean }): string {
  let pool = '';
  if (opts.lower) pool += CHARS.lower;
  if (opts.upper) pool += CHARS.upper;
  if (opts.digits) pool += CHARS.digits;
  if (opts.symbols) pool += CHARS.symbols;
  if (!pool) throw new Error('Select at least one character type');
  const arr = new Uint8Array(len);
  crypto.getRandomValues(arr);
  return Array.from(arr, (b) => pool[b % pool.length]).join('');
}

export function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [output, setOutput] = useState('');
  const [count, setCount] = useState(5);

  const generate = useCallback(() => {
    const opts = { lower, upper, digits, symbols };
    const passwords: string[] = [];
    for (let i = 0; i < Math.min(count, 20); i++) {
      passwords.push(generatePassword(length, opts));
    }
    setOutput(passwords.join('\n'));
  }, [length, lower, upper, digits, symbols, count]);

  const handleRestoreFromShare = useCallback((data: Record<string, unknown>) => {
    if (typeof data.length === 'number') setLength(data.length);
    if (typeof data.lower === 'boolean') setLower(data.lower);
    if (typeof data.upper === 'boolean') setUpper(data.upper);
    if (typeof data.digits === 'boolean') setDigits(data.digits);
    if (typeof data.symbols === 'boolean') setSymbols(data.symbols);
  }, []);

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate secure random passwords. Purpose: Create strong passwords for accounts, APIs, or secrets."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="password-generator"
      singlePanel
      showCopyMinified={false}
      shareData={{ length, lower, upper, digits, symbols }}
      onRestoreFromShare={handleRestoreFromShare}
    >
      <div className="space-y-6">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Length: {length}</label>
            <input
              type="range"
              min={8}
              max={64}
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value, 10))}
              className="w-48"
            />
          </div>
          <div className="flex flex-wrap gap-4">
            {(['lower', 'upper', 'digits', 'symbols'] as const).map((key) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={{ lower, upper, digits, symbols }[key]}
                  onChange={(e) => {
                    const v = e.target.checked;
                    if (key === 'lower') setLower(v);
                    if (key === 'upper') setUpper(v);
                    if (key === 'digits') setDigits(v);
                    if (key === 'symbols') setSymbols(v);
                  }}
                />
                <span className="text-sm capitalize">{key}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Count</label>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(Math.min(20, Math.max(1, parseInt(e.target.value, 10) || 1)))}
              className="w-24 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
            />
          </div>
          <button
            type="button"
            onClick={generate}
            className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
          >
            Generate
          </button>
        </div>
        {output && (
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Generated</label>
            <Editor value={output} onChange={() => {}} language="plaintext" height="200px" readOnly />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
