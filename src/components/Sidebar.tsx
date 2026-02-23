import { NavLink, useNavigate } from 'react-router-dom';
import { TOOLS, DEPARTMENTS } from '../data/tools';
import { useAuth } from '../contexts/AuthContext';
import { getToolsForProfile } from '../utils/toolAccess';
import type { Tool } from '../types';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const tools = getToolsForProfile(TOOLS, profile);

  const byDepartment = tools.reduce<Record<string, Tool[]>>((acc, t) => {
    (acc[t.department] ??= []).push(t);
    return acc;
  }, {});

  return (
    <aside className="w-64 min-w-64 h-full bg-[var(--bg-secondary)] border-r border-[var(--border)] flex flex-col overflow-hidden">
      <div className="p-3 sm:p-4 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <img src="/logo.png" alt="" className="h-8 w-8 object-contain shrink-0" />
          <h1 className="text-base sm:text-lg font-bold text-[var(--accent)] tracking-tight">Corporate Tools</h1>
        </div>
        <button
          type="button"
          className="mt-1.5 flex items-center gap-2 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          onClick={() => window.dispatchEvent(new CustomEvent('open-command-palette'))}
        >
          <kbd className="px-1.5 py-0.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border)] font-mono text-[10px]">
            ⌘K
          </kbd>
          <span>Search tools</span>
        </button>
        {user && (
          <div className="mt-2 pt-2 border-t border-[var(--border)] flex items-center gap-2">
            {user.photoURL && <img src={user.photoURL} alt="" className="w-8 h-8 rounded-full" />}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[var(--text-primary)] truncate">{user.displayName || user.email}</p>
              <p className="text-[10px] text-[var(--text-muted)] truncate">{profile && DEPARTMENTS[profile.department]}</p>
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => navigate('/select-role')}
                className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                title="Change role"
              >
                ⚙
              </button>
              <button
                type="button"
                onClick={() => signOut().then(() => navigate('/login'))}
                className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] text-[var(--text-muted)]"
                title="Sign out"
              >
                🚪
              </button>
            </div>
          </div>
        )}
      </div>
      <nav className="flex-1 min-h-0 overflow-y-auto p-3">
        {Object.entries(byDepartment).map(([dept, tools]) => (
          <div key={dept} className="mb-5">
            <h2 className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider px-2 mb-2">
              {DEPARTMENTS[dept as keyof typeof DEPARTMENTS]}
            </h2>
            <ul className="space-y-0.5">
              {tools.map((tool) => (
                <li key={tool.id}>
                  <NavLink
                    to={tool.path}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] text-sm font-medium no-underline transition-all ${
                        isActive
                          ? 'bg-[var(--accent-muted)] text-[var(--accent)] border border-[var(--accent)]/30'
                          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] border border-transparent'
                      }`
                    }
                  >
                    <span className="text-base w-6 h-6 flex items-center justify-center rounded bg-[var(--bg-tertiary)] shrink-0">
                      {tool.icon}
                    </span>
                    <span className="truncate">{tool.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}
