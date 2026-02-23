import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TOOLS, DEPARTMENTS } from '../data/tools';
import { useAuth } from '../contexts/AuthContext';
import { getToolsForProfile } from '../utils/toolAccess';

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const { profile } = useAuth();
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const navigate = useNavigate();

  const availableTools = useMemo(() => getToolsForProfile(TOOLS, profile), [profile]);

  const filtered = useMemo(() => {
    if (!query.trim()) return availableTools;
    const q = query.toLowerCase();
    return availableTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        DEPARTMENTS[t.department as keyof typeof DEPARTMENTS]?.toLowerCase().includes(q)
    );
  }, [query, availableTools]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelected((s) => Math.min(s + 1, filtered.length - 1));
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelected((s) => Math.max(s - 1, 0));
      }
      if (e.key === 'Enter' && filtered[selected]) {
        e.preventDefault();
        navigate(filtered[selected].path);
        onClose();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected, navigate, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[var(--border)]">
          <span className="text-[var(--text-muted)]">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search tools... (e.g. json, jwt, base64)"
            className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] text-base"
          />
          <kbd className="hidden sm:inline px-2 py-1 rounded bg-[var(--bg-tertiary)] border border-[var(--border)] text-xs text-[var(--text-muted)]">
            ESC to close
          </kbd>
        </div>
        <ul className="max-h-96 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <li className="px-4 py-8 text-center text-[var(--text-muted)]">
              No tools found. Try a different search term.
            </li>
          ) : (
            filtered.map((tool, i) => (
              <li key={tool.id}>
                <button
                  type="button"
                  onClick={() => {
                    navigate(tool.path);
                    onClose();
                  }}
                  onMouseEnter={() => setSelected(i)}
                  className={`w-full flex items-center gap-4 px-4 py-3 text-left transition-colors ${
                    i === selected
                      ? 'bg-[var(--accent-muted)]'
                      : 'hover:bg-[var(--bg-tertiary)]'
                  }`}
                >
                  <span className="w-10 h-10 flex items-center justify-center rounded-lg bg-[var(--bg-tertiary)] text-lg shrink-0">
                    {tool.icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-[var(--text-primary)]">{tool.name}</div>
                    <div className="text-xs text-[var(--text-muted)] mt-0.5">
                      {DEPARTMENTS[tool.department as keyof typeof DEPARTMENTS]}
                    </div>
                  </div>
                  <span className="text-xs text-[var(--text-muted)] shrink-0">
                    {i === selected ? '↵ Enter' : ''}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
        <div className="px-4 py-2 border-t border-[var(--border)] flex gap-4 text-xs text-[var(--text-muted)]">
          <span><kbd className="px-1 rounded bg-[var(--bg-tertiary)]">↑↓</kbd> Navigate</span>
          <span><kbd className="px-1 rounded bg-[var(--bg-tertiary)]">↵</kbd> Select</span>
        </div>
      </div>
    </div>
  );
}
