import { useState, useEffect, useCallback } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useNumberInput } from '../../hooks/useNumberInput';

const API_BASE = 'https://api.frankfurter.app';

type Currencies = Record<string, string>;

export function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<Currencies>({});
  const [amountStr, amount, setAmount] = useNumberInput(100);
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('INR');
  const [result, setResult] = useState('');
  const [rateDate, setRateDate] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/currencies`)
      .then((r) => r.json())
      .then(setCurrencies)
      .catch(() => setCurrencies({ USD: 'US Dollar', EUR: 'Euro', GBP: 'Pound', INR: 'Rupee', JPY: 'Yen', CAD: 'Dollar', AUD: 'Dollar', CHF: 'Franc', CNY: 'Yuan' }));
  }, []);

  const convert = useCallback(async () => {
    if (from === to) {
      setResult(amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setRateDate(null);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/latest?from=${from}&to=${to}`);
      const data = await res.json();
      if (data.message) throw new Error(data.message);
      const rate = data.rates?.[to];
      if (rate == null) throw new Error(`Rate for ${to} not found`);
      const converted = amount * rate;
      setResult(converted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      setRateDate(data.date ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch rates');
      setResult('');
    } finally {
      setLoading(false);
    }
  }, [amount, from, to]);

  useEffect(() => {
    convert();
  }, [convert]);

  const currencyList = Object.keys(currencies).length ? Object.keys(currencies).sort() : ['USD', 'EUR', 'GBP', 'INR', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY'];

  const handleRestoreFromShare = useCallback((data: Record<string, unknown>) => {
    if (typeof data.amount === 'number') setAmount(data.amount);
    else if (typeof data.amount === 'string') setAmount(parseFloat(data.amount) || 100);
    if (typeof data.from === 'string') setFrom(data.from);
    if (typeof data.to === 'string') setTo(data.to);
  }, []);

  return (
    <ToolLayout title="Currency Converter" description="Convert between currencies with live rates. Purpose: Quick FX conversion for invoices, travel, or pricing without leaving your workflow." input="" output={result} onInputChange={() => {}} toolId="currency-converter" singlePanel showCopyMinified={false} shareData={{ amount, from, to }} onRestoreFromShare={handleRestoreFromShare}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <p className="text-xs text-[var(--text-muted)]">Rates from European Central Bank, updated daily. Free API, no key required.</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Amount</label>
          <input type="text" inputMode="decimal" value={amountStr} onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
              {currencyList.map((c) => <option key={c} value={c}>{c} — {currencies[c] || c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
              {currencyList.map((c) => <option key={c} value={c}>{c} — {currencies[c] || c}</option>)}
            </select>
          </div>
        </div>
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-sm text-[var(--text-muted)]">Result {loading && '…'}</p>
          <p className="text-2xl font-bold text-[var(--accent)]">{result || '—'} {to}</p>
          {rateDate && <p className="text-xs text-[var(--text-muted)] mt-1">Rates as of {rateDate}</p>}
        </div>
      </div>
    </ToolLayout>
  );
}
