import type { ReactNode } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Editor } from './Editor';
import { useHistory } from '../hooks/useHistory';
import { Toast } from './Toast';
import { useShareLink } from '../hooks/useShareLink';
import { writeTextToClipboard, readTextFromClipboard } from '../utils/clipboard';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase';
import { logUserActivity } from '../services/activityLogger';

interface ToolLayoutProps {
  title: string;
  description?: string;
  inputLabel?: string;
  outputLabel?: string;
  input: string;
  output: string;
  onInputChange: (v: string) => void;
  inputLanguage?: string;
  outputLanguage?: string;
  toolId: string;
  children?: ReactNode;
  actions?: ReactNode;
  singlePanel?: boolean;
  showCopyMinified?: boolean;
  showDownload?: boolean;
  /** Custom state to encode in share link. Defaults to { input, output }. */
  shareData?: Record<string, unknown>;
  /** Called when restoring from a share link. If not provided, falls back to onInputChange(data.input). */
  onRestoreFromShare?: (data: Record<string, unknown>) => void;
}

export function ToolLayout({
  title,
  description,
  inputLabel = 'Input',
  outputLabel = 'Output',
  input,
  output,
  onInputChange,
  inputLanguage = 'plaintext',
  outputLanguage = 'plaintext',
  toolId,
  children,
  actions,
  singlePanel = false,
  showCopyMinified = true,
  showDownload = true,
  shareData,
  onRestoreFromShare,
}: ToolLayoutProps) {
  const { add, toolHistory } = useHistory(toolId);
  const [toast, setToast] = useState<string | null>(null);
  const { user, isDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { copyShareLink, decodeShare } = useShareLink(toolId);
  const lastInputLogRef = useRef<number>(0);

  useEffect(() => {
    const decoded = decodeShare(location.hash);
    if (!decoded || decoded.toolId !== toolId) return;
    if (onRestoreFromShare) {
      onRestoreFromShare(decoded.data);
    } else if (decoded.data.input !== undefined) {
      onInputChange(String(decoded.data.input));
    }
    navigate(location.pathname, { replace: true });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user || isDemo) return;
    void logUserActivity(db, user.uid, {
      action: 'tool_opened',
      toolId,
      path: location.pathname,
    }).catch(() => {});
  }, [user, isDemo, toolId, location.pathname]);

  useEffect(() => {
    if (!user || isDemo) return;
    const id = window.setTimeout(() => {
      const now = Date.now();
      if (now - lastInputLogRef.current < 10000) return;
      lastInputLogRef.current = now;
      void logUserActivity(db, user.uid, {
        action: 'tool_data_used',
        toolId,
        input,
        output,
        inputLength: input.length,
        outputLength: output.length,
      }).catch(() => {});
    }, 1400);
    return () => clearTimeout(id);
  }, [input, output, user, isDemo, toolId]);

  const showToast = (msg: string) => {
    setToast(msg);
  };

  const handleCopy = async () => {
    const text = output || input;
    if (text) {
      const copied = await writeTextToClipboard(text);
      if (copied) {
        add({ toolId, input, output: text });
        if (user && !isDemo) {
          void logUserActivity(db, user.uid, {
            action: 'copy_clicked',
            toolId,
            output: text,
            outputLength: text.length,
          }).catch(() => {});
        }
        showToast('Copied to clipboard!');
      } else {
        showToast('Unable to copy. Please use keyboard copy.');
      }
    }
  };

  const handleShare = async () => {
    const data = shareData ?? { input, output };
    try {
      await copyShareLink(data);
      if (user && !isDemo) {
        void logUserActivity(db, user.uid, {
          action: 'share_link_created',
          toolId,
        }).catch(() => {});
      }
      showToast('Share link copied! Send to anyone to open the same state.');
    } catch {
      showToast('Unable to copy share link.');
    }
  };

  const handlePaste = async () => {
    try {
      const text = await readTextFromClipboard();
      if (!text) {
        showToast('Clipboard is empty.');
        return;
      }
      onInputChange(text);
      if (user && !isDemo) {
        void logUserActivity(db, user.uid, {
          action: 'paste_clicked',
          toolId,
          input: text,
          inputLength: text.length,
        }).catch(() => {});
      }
      showToast('Pasted from clipboard!');
    } catch {
      showToast('Unable to read clipboard. Use keyboard paste.');
    }
  };

  const handleCopyMinified = async () => {
    try {
      const text = output || input;
      const parsed = JSON.parse(text);
      const copied = await writeTextToClipboard(JSON.stringify(parsed));
      showToast(copied ? 'Copied minified JSON!' : 'Unable to copy.');
    } catch {
      const copied = await writeTextToClipboard(output || input);
      showToast(copied ? 'Copied to clipboard!' : 'Unable to copy.');
    }
  };

  const handleDownload = (filename: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = filename;
    a.click();
    URL.revokeObjectURL(a.href);
    showToast('Download started!');
  };

  const hasJsonOutput = () => {
    try {
      const text = output || input;
      JSON.parse(text);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 sm:px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95">
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-1">Tool Workspace</p>
          <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)] truncate">{title}</h1>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-1 line-clamp-2 sm:line-clamp-none">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)]/70 p-2">
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
          >
            <span>📋</span>
            <span className="hidden sm:inline">Copy</span>
          </button>
          <button
            onClick={handlePaste}
            title="Paste from clipboard"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
          >
            <span>📥</span>
            <span className="hidden sm:inline">Paste</span>
          </button>
          {showCopyMinified && hasJsonOutput() && (
            <button
              onClick={handleCopyMinified}
              title="Copy minified JSON"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
            >
              <span>⌫</span>
              <span className="hidden sm:inline">Minify</span>
            </button>
          )}
          {showDownload && (
            <button
              onClick={() => handleDownload('output.json', output || input, 'application/json')}
              title="Download"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
            >
              <span>⬇</span>
              <span className="hidden sm:inline">Download</span>
            </button>
          )}
          <button
            onClick={handleShare}
            title="Share link"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors shadow-[var(--shadow-card)]"
          >
            <span>↗</span>
            <span className="hidden sm:inline">Share</span>
          </button>
          {actions}
        </div>
      </header>

      {toolHistory.length > 0 && (
        <div className="px-4 sm:px-6 py-3 border-b border-[var(--border)] flex gap-2 overflow-x-auto bg-[var(--bg-secondary)]/45">
          <span className="text-xs font-medium text-[var(--text-muted)] self-center shrink-0">Recent:</span>
          {toolHistory.slice(0, 5).map((h) => (
            <button
              key={h.id}
              onClick={() => onInputChange(h.input)}
              className="text-xs px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] hover:bg-[var(--accent-muted)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] truncate max-w-36 border border-[var(--border)]"
            >
              {h.input.slice(0, 35)}{h.input.length > 35 ? '…' : ''}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6">
        {children ? (
          <div className="flex-1 min-h-0 overflow-y-auto pr-1">
            {children}
          </div>
        ) : singlePanel ? (
          <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-4">
            <label className="block text-sm text-[var(--text-secondary)] mb-2 shrink-0">{inputLabel}</label>
            <Editor value={input} onChange={onInputChange} language={inputLanguage} height="100%" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-4">
              <label className="block text-sm text-[var(--text-secondary)] mb-2 shrink-0">{inputLabel}</label>
              <Editor value={input} onChange={onInputChange} language={inputLanguage} height="100%" />
            </div>
            <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)] p-3 sm:p-4">
              <label className="block text-sm text-[var(--text-secondary)] mb-2 shrink-0">{outputLabel}</label>
              <Editor value={output} onChange={() => {}} language={outputLanguage} height="100%" readOnly />
            </div>
          </div>
        )}
      </div>
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}
