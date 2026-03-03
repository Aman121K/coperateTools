import { useEffect, useMemo, useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../config/firebase';
import { subscribeUserActivities } from '../../services/activityLogger';

interface ActivityRow {
  id: string;
  action?: string;
  toolId?: string;
  input?: string | null;
  output?: string | null;
  inputLength?: number;
  outputLength?: number;
  createdAt?: { seconds?: number; nanoseconds?: number };
  [key: string]: unknown;
}

function formatDate(value: unknown): string {
  const timestamp = Number(value);
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString();
}

export function MyActivity() {
  const { user, authProvider } = useAuth();
  const canReadCloudActivity = authProvider === 'firebase';
  const [rows, setRows] = useState<ActivityRow[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !canReadCloudActivity) {
      setRows([]);
      return;
    }
    const unsub = subscribeUserActivities(
      db,
      user.uid,
      (items) => setRows(items as ActivityRow[]),
      (e) => setError(e.message || 'Failed to load activities.')
    );
    return () => unsub();
  }, [user, canReadCloudActivity]);

  const summary = useMemo(() => {
    const tools = new Set(rows.map((r) => r.toolId).filter(Boolean));
    return { total: rows.length, tools: tools.size };
  }, [rows]);

  return (
    <ToolLayout
      title="My Activity"
      description="Shows your recent tool usage and safe text activity logs (no files/images)."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="my-activity"
      singlePanel
      showCopyMinified={false}
      showDownload={false}
    >
      <div className="space-y-4">
        {!canReadCloudActivity && (
          <p className="text-sm text-[var(--text-muted)]">
            Activity logging is only available with Google login (Firebase).
          </p>
        )}
        {canReadCloudActivity && (
          <div className="flex gap-2 text-xs text-[var(--text-muted)]">
            <span className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">Events: {summary.total}</span>
            <span className="px-2 py-1 rounded border border-[var(--border)] bg-[var(--bg-tertiary)]">Tools used: {summary.tools}</span>
          </div>
        )}
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}

        <div className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden">
          <div className="grid grid-cols-[170px_180px_1fr] gap-2 px-3 py-2 text-xs font-semibold bg-[var(--bg-tertiary)] border-b border-[var(--border)]">
            <span>Time</span>
            <span>Action</span>
            <span>Details</span>
          </div>
          <div className="max-h-[520px] overflow-y-auto">
            {rows.length === 0 ? (
              <div className="px-3 py-6 text-sm text-[var(--text-muted)]">No activity yet.</div>
            ) : (
              rows.map((r) => (
                <div key={r.id} className="grid grid-cols-[170px_180px_1fr] gap-2 px-3 py-2 text-sm border-b border-[var(--border)]/60">
                  <span className="text-[var(--text-muted)]">{formatDate(r.createdAt)}</span>
                  <span className="text-[var(--text-primary)]">{String(r.action || '-')}</span>
                  <span className="text-[var(--text-secondary)] break-all">
                    {r.toolId ? `Tool: ${r.toolId}. ` : ''}
                    {r.inputLength ? `Input chars: ${r.inputLength}. ` : ''}
                    {r.outputLength ? `Output chars: ${r.outputLength}. ` : ''}
                    {r.input ? `Input sample: ${String(r.input).slice(0, 160)} ` : ''}
                    {r.output ? `Output sample: ${String(r.output).slice(0, 160)} ` : ''}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
