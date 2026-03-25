import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEPARTMENTS, TOOLS } from '../data/tools';
import { useAuth } from '../contexts/AuthContext';
import { useToolBookmarks } from '../hooks/useToolBookmarks';
import { getToolsForProfile } from '../utils/toolAccess';
import { SiteFooter } from '../components/SiteFooter';

function ToolCard({
  id,
  name,
  icon,
  department,
  path,
  onOpen,
  bookmarked,
  onToggleBookmark,
}: {
  id: string;
  name: string;
  icon: string;
  department: string;
  path: string;
  onOpen: (path: string) => void;
  bookmarked: boolean;
  onToggleBookmark: (toolId: string) => void;
}) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[linear-gradient(180deg,var(--bg-secondary),rgba(27,42,62,0.88))] p-4 sm:p-5 shadow-[var(--shadow-card)] transition-all hover:border-[var(--accent)]/45 hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="w-11 h-11 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] flex items-center justify-center text-xl shrink-0">
            {icon}
          </span>
          <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-semibold text-[var(--text-primary)] truncate">{name}</h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">{department}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onToggleBookmark(id)}
          aria-label={bookmarked ? `Remove ${name} bookmark` : `Bookmark ${name}`}
          className={`rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors ${
            bookmarked
              ? 'bg-[var(--accent-muted)] border-[var(--accent)]/45 text-[var(--text-primary)]'
              : 'bg-[var(--bg-tertiary)] border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]'
          }`}
        >
          {bookmarked ? '★ Saved' : '☆ Save'}
        </button>
      </div>

      <button
        type="button"
        onClick={() => onOpen(path)}
        className="mt-4 w-full rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-4 py-2.5 transition-colors"
      >
        Open Tool
      </button>
    </div>
  );
}

export function ToolSelectionPage() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { bookmarkedIdSet, toggleBookmark } = useToolBookmarks();
  const [query, setQuery] = useState('');

  const tools = useMemo(() => getToolsForProfile(TOOLS, profile), [profile]);

  const filteredTools = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tools;
    return tools.filter((tool) => {
      const department = DEPARTMENTS[tool.department as keyof typeof DEPARTMENTS] || tool.department;
      return (
        tool.name.toLowerCase().includes(q) ||
        tool.id.toLowerCase().includes(q) ||
        tool.category.toLowerCase().includes(q) ||
        department.toLowerCase().includes(q)
      );
    });
  }, [query, tools]);

  const bookmarkedTools = useMemo(
    () => tools.filter((tool) => bookmarkedIdSet.has(tool.id)),
    [bookmarkedIdSet, tools]
  );

  const openTool = (path: string) => {
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-5 sm:p-8 shadow-[var(--shadow-elevated)] animate-fade-up">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Step 2 of 2</p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">Choose your tools</h1>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {user?.displayName || user?.email || 'User'}, save the tools you use most and launch any tool to enter the main workspace.
            </p>
          </div>
          <div className="w-full sm:max-w-sm">
            <label htmlFor="tool-search" className="sr-only">Search tools</label>
            <input
              id="tool-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by tool, department, category..."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-4 py-3 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/55"
            />
          </div>
        </div>

        {bookmarkedTools.length > 0 && (
          <section className="mt-7">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)]">Bookmarked Tools</h2>
              <span className="text-xs text-[var(--text-muted)]">{bookmarkedTools.length} saved</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {bookmarkedTools.map((tool) => (
                <ToolCard
                  key={`bookmark-${tool.id}`}
                  id={tool.id}
                  name={tool.name}
                  icon={tool.icon}
                  department={DEPARTMENTS[tool.department as keyof typeof DEPARTMENTS] ?? tool.department}
                  path={tool.path}
                  onOpen={openTool}
                  bookmarked
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          </section>
        )}

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm font-semibold tracking-[0.1em] uppercase text-[var(--text-muted)]">All Tools</h2>
            <span className="text-xs text-[var(--text-muted)]">
              Showing {filteredTools.length} of {tools.length}
            </span>
          </div>
          {filteredTools.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border)] bg-[var(--bg-tertiary)]/45 p-8 text-center">
              <p className="text-sm text-[var(--text-secondary)]">No tools matched your search.</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredTools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  id={tool.id}
                  name={tool.name}
                  icon={tool.icon}
                  department={DEPARTMENTS[tool.department as keyof typeof DEPARTMENTS] ?? tool.department}
                  path={tool.path}
                  onOpen={openTool}
                  bookmarked={bookmarkedIdSet.has(tool.id)}
                  onToggleBookmark={toggleBookmark}
                />
              ))}
            </div>
          )}
        </section>
      </div>
      </main>
      <SiteFooter />
    </div>
  );
}
