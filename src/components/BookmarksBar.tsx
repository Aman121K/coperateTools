import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS } from '../data/tools';
import { useToolBookmarks } from '../hooks/useToolBookmarks';
import type { Tool } from '../types';

export function BookmarksBar() {
  const navigate = useNavigate();
  const { bookmarkedIds, toggleBookmark } = useToolBookmarks();

  const bookmarkedTools = useMemo(
    () =>
      bookmarkedIds
        .map((id) => TOOLS.find((tool) => tool.id === id))
        .filter((tool): tool is Tool => Boolean(tool)),
    [bookmarkedIds]
  );

  if (bookmarkedTools.length === 0) return null;

  return (
    <div className="shrink-0 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95">
      <div className="flex items-center gap-2 overflow-x-auto px-3 sm:px-6 py-2.5">
        <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] pr-1 shrink-0">Bookmarks</span>
        {bookmarkedTools.map((tool) => (
          <div
            key={tool.id}
            className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--bg-tertiary)] px-2 py-1.5 shrink-0"
          >
            <button
              type="button"
              onClick={() => navigate(tool.path)}
              className="flex items-center gap-2 text-xs sm:text-sm text-[var(--text-primary)] hover:text-[var(--accent)] transition-colors"
              title={`Open ${tool.name}`}
            >
              <span>{tool.icon}</span>
              <span className="whitespace-nowrap">{tool.name}</span>
            </button>
            <button
              type="button"
              onClick={() => toggleBookmark(tool.id)}
              className="w-5 h-5 rounded border border-[var(--border)] bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-[11px]"
              aria-label={`Remove ${tool.name} bookmark`}
              title="Remove bookmark"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
