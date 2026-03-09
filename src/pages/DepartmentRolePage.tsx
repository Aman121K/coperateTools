import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DEPARTMENTS, TOOLS } from '../data/tools';
import { getRolesForDepartment } from '../data/roles';
import { getToolsForProfile } from '../utils/toolAccess';
import type { Department } from '../types';

export function DepartmentRolePage() {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuth();
  const [dept, setDept] = useState<Department | null>(profile?.department ?? null);
  const [roleId, setRoleId] = useState<string | null>(profile?.roleId ?? null);

  const roles = dept ? getRolesForDepartment(dept) : [];
  const deptList = Object.keys(DEPARTMENTS) as Department[];
  const selectedToolCount = useMemo(() => {
    if (!dept || !roleId) return 0;
    return getToolsForProfile(TOOLS, { department: dept, roleId }).length;
  }, [dept, roleId]);

  const handleSave = () => {
    if (dept && roleId) {
      setProfile({ department: dept, roleId });
      navigate('/choose-tools', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-[var(--shadow-elevated)] animate-fade-up">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div className="h-14 w-14 rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)] flex items-center justify-center">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="" className="h-12 w-12 rounded-xl object-cover" />
            ) : (
              <span className="text-xl">👤</span>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Step 1 of 2</p>
            <h1 className="text-2xl font-semibold text-[var(--text-primary)] truncate">
              Set up your workspace profile
            </h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              Welcome {user?.displayName || user?.email || 'User'}. Select the department and role that best match your work. You can change this later.
            </p>
          </div>
        </div>

        <div className="space-y-7">
          <button
            type="button"
            onClick={() => {
              setDept('general');
              setRoleId('general');
            }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl font-medium transition-all border ${
              dept === 'general'
                ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                : 'bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border)]'
            }`}
          >
            <span>📂</span>
            <span>Browse all tools ({TOOLS.length} available)</span>
          </button>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)]/45 p-4 sm:p-5">
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
              Or pick a department
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {deptList.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDept(d);
                    setRoleId(null);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                    dept === d
                      ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                      : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border)]'
                  }`}
                >
                  {DEPARTMENTS[d as keyof typeof DEPARTMENTS]}
                </button>
              ))}
            </div>
          </div>

          {dept && (
            <div className="rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)]/45 p-4 sm:p-5">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">
                Role
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoleId(r.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium border transition-all ${
                      roleId === r.id
                        ? 'bg-[var(--accent)] text-white border-[var(--accent)]'
                        : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] border-[var(--border)]'
                    }`}
                  >
                    <span>{r.icon}</span>
                    <span className="truncate">{r.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {dept && roleId && (
          <p className="mt-5 text-sm text-[var(--text-secondary)]">
            {dept === 'general' || roleId === 'general' ? (
              <>You will have access to <strong>all {TOOLS.length} tools</strong>.</>
            ) : (
              <>You will see <strong>{selectedToolCount} tools</strong> for this department and role in your dashboard.</>
            )}
          </p>
        )}

        <div className="mt-6 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dept || !roleId}
            className="flex-1 py-3.5 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-colors"
          >
            Continue to Tools
          </button>
          {profile && (
            <button
              type="button"
              onClick={() => navigate('/choose-tools', { replace: true })}
              className="px-4 py-3.5 rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] hover:bg-[var(--bg-elevated)] text-[var(--text-primary)] font-medium"
            >
              Keep current profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
