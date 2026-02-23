import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DEPARTMENTS, TOOLS } from '../data/tools';
import { getRolesForDepartment } from '../data/roles';
import type { Department } from '../types';

export function DepartmentRolePage() {
  const navigate = useNavigate();
  const { user, profile, setProfile } = useAuth();

  useEffect(() => {
    if (!user) navigate('/login', { replace: true });
  }, [user, navigate]);
  const [dept, setDept] = useState<Department | null>(profile?.department ?? null);
  const [roleId, setRoleId] = useState<string | null>(profile?.roleId ?? null);

  const roles = dept ? getRolesForDepartment(dept) : [];
  const deptList = Object.keys(DEPARTMENTS) as Department[];

  const handleSave = () => {
    if (dept && roleId) {
      setProfile({ department: dept, roleId });
      navigate('/tools/finance/currency', { replace: true });
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-primary)] p-6">
      <div className="w-full max-w-lg rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-8 shadow-2xl shadow-black/20">
        <div className="flex items-center gap-3 mb-6">
          {user?.photoURL && (
            <img src={user.photoURL} alt="" className="w-12 h-12 rounded-full" />
          )}
          <div>
            <h1 className="text-xl font-bold text-[var(--text-primary)]">
              Welcome, {user?.displayName || user?.email || 'User'}
            </h1>
            <p className="text-sm text-[var(--text-muted)]">Choose your area to see relevant tools, or browse all</p>
          </div>
        </div>

        <div className="space-y-6">
          <button
            type="button"
            onClick={() => {
              setDept('general');
              setRoleId('general');
            }}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-medium transition-all ${
              dept === 'general'
                ? 'bg-[var(--accent)] text-white'
                : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)] border border-[var(--border)]'
            }`}
          >
            <span>📂</span>
            <span>Browse all tools ({TOOLS.length}+)</span>
          </button>

          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
              Or pick a department
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {deptList.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDept(d);
                    setRoleId(null);
                  }}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    dept === d
                      ? 'bg-[var(--accent)] text-white'
                      : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)]'
                  }`}
                >
                  {DEPARTMENTS[d as keyof typeof DEPARTMENTS]}
                </button>
              ))}
            </div>
          </div>

          {dept && (
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {roles.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRoleId(r.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      roleId === r.id
                        ? 'bg-[var(--accent)] text-white'
                        : 'bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)]'
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
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            You’ll have access to <strong>all {TOOLS.length}+ tools</strong> — your selection helps us personalize your experience.
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={!dept || !roleId}
            className="flex-1 py-3 rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium transition-colors"
          >
            Continue to Tools
          </button>
          {profile && (
            <button
              type="button"
              onClick={() => navigate('/tools/finance/currency', { replace: true })}
              className="px-4 py-3 rounded-xl bg-[var(--bg-tertiary)] hover:bg-[var(--border)] text-[var(--text-primary)] font-medium"
            >
              Keep current
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
