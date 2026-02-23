import type { ReactNode } from 'react';
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Editor } from './Editor';
import { useHistory } from '../hooks/useHistory';
import { Toast } from './Toast';
import { useShareLink } from '../hooks/useShareLink';

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
  shareData,
  onRestoreFromShare,
}: ToolLayoutProps) {
  const { add, toolHistory } = useHistory(toolId);
  const [toast, setToast] = useState<string | null>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { copyShareLink, decodeShare } = useShareLink(toolId);

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

  const showToast = (msg: string) => {
    setToast(msg);
  };

  const handleCopy = () => {
    const text = output || input;
    if (text) {
      navigator.clipboard.writeText(text);
      add({ toolId, input, output: text });
      showToast('Copied to clipboard!');
    }
  };

  const handleShare = () => {
    const data = shareData ?? { input, output };
    copyShareLink(data);
    showToast('Share link copied! Send to anyone to open the same state.');
  };

  const handleCopyMinified = () => {
    try {
      const text = output || input;
      const parsed = JSON.parse(text);
      navigator.clipboard.writeText(JSON.stringify(parsed));
      showToast('Copied minified JSON!');
    } catch {
      navigator.clipboard.writeText(output || input);
      showToast('Copied to clipboard!');
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
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)]">
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-semibold text-[var(--text-primary)] truncate">{title}</h1>
          {description && (
            <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-2 sm:line-clamp-none">{description}</p>
          )}
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          <button
            onClick={handleCopy}
            title="Copy to clipboard"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
          >
            <span>📋</span>
            <span className="hidden sm:inline">Copy</span>
          </button>
          {showCopyMinified && hasJsonOutput() && (
            <button
              onClick={handleCopyMinified}
              title="Copy minified JSON"
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
            >
              <span>⌫</span>
              <span className="hidden sm:inline">Minify</span>
            </button>
          )}
          <button
            onClick={() => handleDownload('output.json', output || input, 'application/json')}
            title="Download"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)] transition-colors"
          >
            <span>⬇</span>
            <span className="hidden sm:inline">Download</span>
          </button>
          <button
            onClick={handleShare}
            title="Share link"
            className="flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white transition-colors"
          >
            <span>↗</span>
            <span className="hidden sm:inline">Share</span>
          </button>
          {actions}
        </div>
      </header>

      {toolHistory.length > 0 && (
        <div className="px-6 py-2.5 border-b border-[var(--border)] flex gap-2 overflow-x-auto bg-[var(--bg-secondary)]/50">
          <span className="text-xs font-medium text-[var(--text-muted)] self-center shrink-0">Recent:</span>
          {toolHistory.slice(0, 5).map((h) => (
            <button
              key={h.id}
              onClick={() => onInputChange(h.input)}
              className="text-xs px-2.5 py-1.5 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] hover:bg-[var(--accent-muted)] hover:text-[var(--accent)] truncate max-w-36 border border-transparent hover:border-[var(--border)]"
            >
              {h.input.slice(0, 35)}{h.input.length > 35 ? '…' : ''}
            </button>
          ))}
        </div>
      )}

      <div className="flex-1 min-h-0 flex flex-col p-4 sm:p-6">
        {children ? (
          children
        ) : singlePanel ? (
          <div className="flex-1 min-h-0 flex flex-col">
            <label className="block text-sm text-[var(--text-secondary)] mb-2 shrink-0">{inputLabel}</label>
            <Editor value={input} onChange={onInputChange} language={inputLanguage} height="100%" />
          </div>
        ) : (
          <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-h-0 flex flex-col">
              <label className="block text-sm text-[var(--text-secondary)] mb-2 shrink-0">{inputLabel}</label>
              <Editor value={input} onChange={onInputChange} language={inputLanguage} height="100%" />
            </div>
            <div className="flex-1 min-h-0 flex flex-col">
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
