import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

type Mode = 'to-date' | 'to-timestamp';

const TIMEZONES: { label: string; tz: string }[] = [
  { label: 'UTC / GMT', tz: 'UTC' },
  { label: 'India (IST)', tz: 'Asia/Kolkata' },
  { label: 'Pakistan (PKT)', tz: 'Asia/Karachi' },
  { label: 'Bangladesh (BST)', tz: 'Asia/Dhaka' },
  { label: 'Sri Lanka (IST)', tz: 'Asia/Colombo' },
  { label: 'Nepal (NPT)', tz: 'Asia/Kathmandu' },
  { label: 'UK (GMT/BST)', tz: 'Europe/London' },
  { label: 'USA - New York (EST/EDT)', tz: 'America/New_York' },
  { label: 'USA - Los Angeles (PST/PDT)', tz: 'America/Los_Angeles' },
  { label: 'USA - Chicago (CST/CDT)', tz: 'America/Chicago' },
  { label: 'USA - Denver (MST/MDT)', tz: 'America/Denver' },
  { label: 'UAE - Dubai (GST)', tz: 'Asia/Dubai' },
  { label: 'Saudi Arabia (AST)', tz: 'Asia/Riyadh' },
  { label: 'Singapore (SGT)', tz: 'Asia/Singapore' },
  { label: 'Japan (JST)', tz: 'Asia/Tokyo' },
  { label: 'China (CST)', tz: 'Asia/Shanghai' },
  { label: 'Australia - Sydney (AEST)', tz: 'Australia/Sydney' },
  { label: 'Australia - Melbourne (AEST)', tz: 'Australia/Melbourne' },
  { label: 'Germany (CET/CEST)', tz: 'Europe/Berlin' },
  { label: 'France (CET/CEST)', tz: 'Europe/Paris' },
  { label: 'Russia - Moscow (MSK)', tz: 'Europe/Moscow' },
  { label: 'Brazil - São Paulo (BRT)', tz: 'America/Sao_Paulo' },
  { label: 'South Africa (SAST)', tz: 'Africa/Johannesburg' },
  { label: 'Egypt (EET)', tz: 'Africa/Cairo' },
  { label: 'Canada - Toronto (EST/EDT)', tz: 'America/Toronto' },
  { label: 'Canada - Vancouver (PST/PDT)', tz: 'America/Vancouver' },
  { label: 'Mexico City (CST/CDT)', tz: 'America/Mexico_City' },
  { label: 'Hong Kong (HKT)', tz: 'Asia/Hong_Kong' },
  { label: 'South Korea (KST)', tz: 'Asia/Seoul' },
  { label: 'Indonesia - Jakarta (WIB)', tz: 'Asia/Jakarta' },
  { label: 'Thailand (ICT)', tz: 'Asia/Bangkok' },
  { label: 'Vietnam (ICT)', tz: 'Asia/Ho_Chi_Minh' },
  { label: 'Philippines (PHT)', tz: 'Asia/Manila' },
  { label: 'Turkey (TRT)', tz: 'Europe/Istanbul' },
  { label: 'Israel (IST)', tz: 'Asia/Jerusalem' },
  { label: 'Nigeria (WAT)', tz: 'Africa/Lagos' },
  { label: 'Kenya (EAT)', tz: 'Africa/Nairobi' },
];

function formatInTimezone(date: Date, tz: string): string {
  return date.toLocaleString('en-US', {
    timeZone: tz,
    dateStyle: 'medium',
    timeStyle: 'long',
  });
}

export function TimestampConverter() {
  const [mode, setMode] = useState<Mode>('to-date');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [selectedTimezones, setSelectedTimezones] = useState<string[]>(['UTC', 'Asia/Kolkata', 'Asia/Karachi', 'Europe/London', 'America/New_York']);

  useEffect(() => {
    setError('');
    if (!input.trim()) {
      setOutput('');
      return;
    }
    try {
      if (mode === 'to-date') {
        const ts = input.trim();
        const num = ts.length <= 10 ? parseInt(ts, 10) * 1000 : parseInt(ts, 10);
        if (isNaN(num)) throw new Error('Invalid number');
        const d = new Date(num);
        if (isNaN(d.getTime())) throw new Error('Invalid timestamp');

        const lines: string[] = [
          'UTC:  ' + d.toISOString(),
          'Local: ' + d.toLocaleString(),
          '',
          '--- World times ---',
        ];

        selectedTimezones.forEach((tz) => {
          const tzInfo = TIMEZONES.find((t) => t.tz === tz);
          const label = tzInfo?.label ?? tz;
          lines.push(`${label}: ${formatInTimezone(d, tz)}`);
        });

        setOutput(lines.join('\n'));
      } else {
        const d = new Date(input.trim());
        if (isNaN(d.getTime())) throw new Error('Invalid date');
        setOutput(String(Math.floor(d.getTime() / 1000)) + '\n' + String(d.getTime()));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid input');
      setOutput('');
    }
  }, [input, mode, selectedTimezones]);

  const now = () => {
    const ts = Math.floor(Date.now() / 1000);
    setInput(String(ts));
    setMode('to-date');
  };

  const addTimezone = (tz: string) => {
    if (!selectedTimezones.includes(tz)) {
      setSelectedTimezones((prev) => [...prev, tz]);
    }
  };

  const removeTimezone = (tz: string) => {
    setSelectedTimezones((prev) => prev.filter((t) => t !== tz));
  };

  return (
    <ToolLayout
      title="Timestamp Converter"
      description="Convert Unix timestamp ↔ human date. Purpose: Debug API responses, log parsing, or cron scheduling."
      input={input}
      output={output}
      onInputChange={setInput}
      toolId="timestamp"
      showCopyMinified={false}
      shareData={{ mode, input, selectedTimezones }}
      onRestoreFromShare={(d) => {
        if (typeof d.mode === 'string') setMode(d.mode as Mode);
        if (typeof d.input === 'string') setInput(d.input);
        if (Array.isArray(d.selectedTimezones)) setSelectedTimezones(d.selectedTimezones);
      }}
      actions={
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as Mode)}
            className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)]"
          >
            <option value="to-date">Timestamp → Date</option>
            <option value="to-timestamp">Date → Timestamp</option>
          </select>
          {mode === 'to-date' && (
            <select
              value=""
              onChange={(e) => {
                const v = e.target.value;
                if (v) addTimezone(v);
                e.target.value = '';
              }}
              className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] text-[var(--text-primary)] max-w-[200px]"
              title="Add timezone to view"
            >
              <option value="">+ Add country timezone</option>
              {TIMEZONES.filter((t) => !selectedTimezones.includes(t.tz)).map((t) => (
                <option key={t.tz} value={t.tz}>
                  {t.label}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={now}
            className="px-3 py-1.5 text-sm rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] hover:bg-[var(--border)] text-[var(--text-primary)]"
          >
            Now
          </button>
        </div>
      }
    >
      <div className="space-y-4">
      {mode === 'to-date' && selectedTimezones.length > 0 && (
        <div className="px-3 sm:px-4 py-2 flex flex-wrap items-center gap-2 border border-[var(--border)] rounded-[var(--radius-sm)] bg-[var(--bg-secondary)]/50">
          <span className="text-xs text-[var(--text-muted)]">Showing:</span>
          {selectedTimezones.map((tz) => {
            const info = TIMEZONES.find((t) => t.tz === tz);
            return (
              <span
                key={tz}
                className="inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-[var(--bg-tertiary)] border border-[var(--border)]"
              >
                {info?.label ?? tz}
                <button
                  type="button"
                  onClick={() => removeTimezone(tz)}
                  className="hover:text-[var(--error)]"
                  aria-label={`Remove ${info?.label ?? tz}`}
                >
                  ×
                </button>
              </span>
            );
          })}
          <button
            type="button"
            onClick={() => setSelectedTimezones(['UTC', 'Asia/Kolkata', 'Asia/Karachi', 'Europe/London', 'America/New_York'])}
            className="text-xs text-[var(--text-muted)] hover:text-[var(--accent)]"
          >
            Reset
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-4">
          <label className="block text-sm text-[var(--text-secondary)] mb-2 shrink-0">
            {mode === 'to-date' ? 'Unix timestamp (seconds or ms)' : 'Date (ISO, locale, or natural)'}
          </label>
          <Editor value={input} onChange={setInput} language="plaintext" height="300px" />
          {error && <p className="mt-2 text-red-500 text-sm shrink-0">{error}</p>}
        </div>
        <div className="rounded-[var(--radius)] border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-4">
          <label className="block text-sm text-[var(--text-secondary)] mb-2 shrink-0">Result</label>
          <Editor value={output} onChange={() => {}} language="plaintext" height="300px" readOnly />
        </div>
      </div>
      </div>
    </ToolLayout>
  );
}
