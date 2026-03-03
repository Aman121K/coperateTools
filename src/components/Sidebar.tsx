import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TOOLS, DEPARTMENTS } from '../data/tools';
import { useAuth } from '../contexts/AuthContext';
import { getToolsForProfile } from '../utils/toolAccess';
import { useToolBookmarks } from '../hooks/useToolBookmarks';
import type { Tool } from '../types';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const { bookmarkedIds, isBookmarked, toggleBookmark } = useToolBookmarks();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const tools = getToolsForProfile(TOOLS, profile);
  const bookmarkedTools = bookmarkedIds
    .map((toolId) => tools.find((tool) => tool.id === toolId))
    .filter((tool): tool is Tool => Boolean(tool));

  const byDepartment = tools.reduce<Record<string, Tool[]>>((acc, t) => {
    (acc[t.department] ??= []).push(t);
    return acc;
  }, {});

  return (
    <aside className="w-72 min-w-72 h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col overflow-hidden shadow-[var(--shadow-card)]">
      <div className="p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center shadow-[var(--shadow-card)]">
            <img src="/logo.png" alt="Corporate Tools" className="h-9 w-9 object-contain shrink-0" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">Hub</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] truncate">Internal Tools Hub</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 flex items-center gap-2 w-full px-3.5 py-3 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] hover:bg-[var(--accent-muted)] hover:border-[var(--accent)]/35 border border-[var(--border)] transition-colors text-left"
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
        >
          <span className="text-[var(--text-muted)]">🔍</span>
          <span className="flex-1 text-sm text-[var(--text-secondary)]">Search a tool or feature</span>
          <kbd className="hidden sm:inline px-2 py-1 rounded bg-[var(--bg-secondary)] border border-[var(--border)] font-mono text-[10px] text-[var(--text-muted)]">
            ⌘K
          </kbd>
        </button>
        {user && (
          <div className="mt-4 pt-3 border-t border-[var(--border)] relative">
            <button
              type="button"
              onClick={() => setMenuOpen((s) => !s)}
              className="w-full flex items-center gap-2 rounded-[var(--radius-sm)] px-2 py-2 hover:bg-[var(--bg-tertiary)] border border-transparent hover:border-[var(--border)]"
            >
              {user.photoURL ? (
                <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />
              ) : (
                <span className="w-8 h-8 rounded-full bg-[var(--bg-tertiary)] border border-[var(--border)] flex items-center justify-center text-xs text-[var(--text-secondary)]">
                  {(user.displayName || user.email || 'U').slice(0, 1).toUpperCase()}
                </span>
              )}
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-[var(--text-primary)] truncate">{user.displayName || user.email}</p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">{profile && DEPARTMENTS[profile.department]}</p>
              </div>
              <span className="text-[var(--text-muted)] text-xs">{menuOpen ? '▲' : '▼'}</span>
            </button>

            {menuOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[var(--bg-secondary)] shadow-[var(--shadow-card)] overflow-hidden z-20">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/tools/admin/my-activity');
                    onNavigate?.();
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  🕘 My Activity
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/select-role');
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)]"
                >
                  ⚙ Change Role
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    signOut().then(() => navigate('/login'));
                  }}
                  className="w-full text-left px-3 py-2.5 text-sm text-[var(--error)] hover:bg-[var(--bg-tertiary)]"
                >
                  🚪 Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto px-3 py-4">
        {bookmarkedTools.length > 0 && (
          <div className="mb-5">
            <h2 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.14em] px-2 mb-2">
              Bookmarked
            </h2>
            <ul className="space-y-1">
              {bookmarkedTools.map((tool) => (
                <li key={`bookmark-${tool.id}`}>
                  <div className="group flex items-center gap-2 rounded-[var(--radius-sm)] border border-transparent hover:border-[var(--border)] pr-1">
                    <NavLink
                      to={tool.path}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex-1 flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium no-underline transition-all ${
                          isActive
                            ? 'bg-[var(--accent-muted)] text-[var(--text-primary)] border border-[var(--accent)]/35 shadow-[var(--shadow-card)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent'
                        }`
                      }
                    >
                      <span className="text-base w-7 h-7 flex items-center justify-center rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] shrink-0">
                        {tool.icon}
                      </span>
                      <span className="truncate">{tool.name}</span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(tool.id)}
                      className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)] text-xs shrink-0"
                      aria-label={`Remove ${tool.name} bookmark`}
                    >
                      ★
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {Object.entries(byDepartment).map(([dept, tools]) => (
          <div key={dept} className="mb-5">
            <h2 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-[0.14em] px-2 mb-2">
              {DEPARTMENTS[dept as keyof typeof DEPARTMENTS]}
            </h2>
            <ul className="space-y-1">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <div className="group flex items-center gap-2 rounded-[var(--radius-sm)] border border-transparent hover:border-[var(--border)] pr-1">
                    <NavLink
                      to={tool.path}
                      onClick={onNavigate}
                      className={({ isActive }) =>
                        `flex-1 flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium no-underline transition-all ${
                          isActive
                            ? 'bg-[var(--accent-muted)] text-[var(--text-primary)] border border-[var(--accent)]/35 shadow-[var(--shadow-card)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent'
                        }`
                      }
                    >
                      <span className="text-base w-7 h-7 flex items-center justify-center rounded-md bg-[var(--bg-tertiary)] border border-[var(--border)] shrink-0">
                        {tool.icon}
                      </span>
                      <span className="truncate">{tool.name}</span>
                    </NavLink>
                    <button
                      type="button"
                      onClick={() => toggleBookmark(tool.id)}
                      className={`w-7 h-7 rounded-md border text-xs shrink-0 transition-colors ${
                        isBookmarked(tool.id)
                          ? 'border-[var(--accent)]/40 bg-[var(--accent-muted)] text-[var(--text-primary)]'
                          : 'border-[var(--border)] bg-[var(--bg-tertiary)] text-[var(--text-muted)] hover:bg-[var(--bg-elevated)] hover:text-[var(--text-primary)]'
                      }`}
                      aria-label={isBookmarked(tool.id) ? `Remove ${tool.name} bookmark` : `Bookmark ${tool.name}`}
                    >
                      {isBookmarked(tool.id) ? '★' : '☆'}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
