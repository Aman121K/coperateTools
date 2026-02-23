import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { NumberInput } from '../../components/NumberInput';

type Platform = 'upwork' | 'fiverr' | 'custom';

const PLATFORMS: { id: Platform; name: string; fee1: number; fee2?: number; threshold?: number }[] = [
  { id: 'upwork', name: 'Upwork', fee1: 20, fee2: 10, threshold: 500 },
  { id: 'fiverr', name: 'Fiverr', fee1: 20 },
  { id: 'custom', name: 'Custom', fee1: 20 },
];

export function PlatformFeeCalculator() {
  const [platform, setPlatform] = useState<Platform>('upwork');
  const [grossAmount, setGrossAmount] = useState(1000);
  const [customFee, setCustomFee] = useState(20);
  const [result, setResult] = useState({ fee: 0, net: 0, feePercent: 0 });

  useEffect(() => {
    const p = PLATFORMS.find((x) => x.id === platform);
    if (!p) return;
    const feePercent = platform === 'custom' ? customFee : p.fee2 !== undefined && grossAmount > (p.threshold ?? 0) ? p.fee2 : p.fee1;
    const fee = grossAmount * (feePercent / 100);
    const net = grossAmount - fee;
    setResult({ fee, net, feePercent });
  }, [platform, grossAmount, customFee]);

  const output = JSON.stringify(
    {
      platform: PLATFORMS.find((p) => p.id === platform)?.name,
      grossAmount,
      feePercent: result.feePercent,
      platformFee: result.fee,
      netEarnings: result.net,
    },
    null,
    2
  );

  return (
    <ToolLayout
      title="Platform Fee Calculator"
      description="Calculate net earnings after Upwork, Fiverr, or custom platform fees. Purpose: Know your take-home pay from gig platforms."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="platform-fee-calc"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Platform</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlatform(p.id)}
                className={`px-3 py-2 rounded-[var(--radius-sm)] text-sm font-medium transition-all ${
                  platform === p.id ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-secondary)] border border-[var(--border)] hover:border-[var(--accent)]/50'
                }`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Gross Amount (client paid)</label>
          <NumberInput value={grossAmount} onChange={setGrossAmount} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
        </div>
        {platform === 'custom' && (
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Platform Fee (%)</label>
            <NumberInput value={customFee} onChange={setCustomFee} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]" />
          </div>
        )}
        <div className="p-4 rounded-[var(--radius-sm)] bg-[var(--accent-muted)] border border-[var(--accent)]/30 space-y-2">
          <p className="text-sm text-[var(--text-secondary)]">Platform fee ({result.feePercent}%): ₹{result.fee.toFixed(2)}</p>
          <p className="text-lg font-bold text-[var(--accent)]">Your net: ₹{result.net.toFixed(2)}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
