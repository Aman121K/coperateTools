import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

const ONES = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
const TENS = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
const TEENS = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];

function toWords(n: number): string {
  if (n === 0) return 'Zero';
  if (n < 0) return 'Minus ' + toWords(-n);
  if (n < 10) return ONES[n];
  if (n < 20) return TEENS[n - 10];
  if (n < 100) return TENS[Math.floor(n / 10)] + (n % 10 ? ' ' + ONES[n % 10] : '');
  if (n < 1000) return ONES[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + toWords(n % 100) : '');
  if (n < 100000) return toWords(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
  if (n < 10000000) return toWords(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + toWords(n % 100000) : '');
  if (n < 1000000000) return toWords(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + toWords(n % 10000000) : '');
  return n.toString();
}

export function NumberToWords() {
  const [input, setInput] = useState('12345');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const num = parseFloat(input.replace(/,/g, ''));
    if (Number.isNaN(num) || !Number.isInteger(num)) {
      setError('Enter a valid integer');
      setOutput('');
    } else if (Math.abs(num) > 999999999) {
      setError('Number too large');
      setOutput('');
    } else {
      setError('');
      setOutput(toWords(Math.floor(num)));
    }
  }, [input]);

  return (
    <ToolLayout title="Number to Words" description="Convert numbers to words. Purpose: Write cheque amounts, spell out figures in invoices or legal documents to avoid fraud." input={input} output={output} onInputChange={setInput} toolId="number-to-words" singlePanel showCopyMinified={false}>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Enter number</label>
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. 12345" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
          {error && <p className="mt-2 text-sm text-[var(--error)]">⚠ {error}</p>}
        </div>
        {output && (
          <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <p className="text-sm text-[var(--text-muted)]">In words</p>
            <p className="text-lg font-medium capitalize">{output}</p>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
