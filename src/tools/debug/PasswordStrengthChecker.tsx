import { useState, useMemo } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

function checkStrength(pwd: string): { score: number; label: string; color: string; feedback: string[] } {
  const feedback: string[] = [];
  let score = 0;
  if (pwd.length >= 8) score += 1;
  else feedback.push('Add at least 8 characters');
  if (pwd.length >= 12) score += 1;
  if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score += 1;
  else feedback.push('Use both upper and lowercase');
  if (/\d/.test(pwd)) score += 1;
  else feedback.push('Add numbers');
  if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
  else feedback.push('Add special characters (!@#$%)');
  if (pwd.length > 0 && score < 3) feedback.push('Avoid common patterns');
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['text-[var(--error)]', 'text-[var(--error)]', 'text-yellow-500', 'text-[var(--success)]', 'text-[var(--success)]'];
  return { score, label: labels[Math.min(score, 4)], color: colors[Math.min(score, 4)], feedback: feedback.length ? feedback : ['Strong password!'] };
}

export function PasswordStrengthChecker() {
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const strength = useMemo(() => checkStrength(password), [password]);

  return (
    <ToolLayout title="Password Strength Checker" description="Check password strength and get improvement tips. Purpose: Create secure passwords for accounts or compliance." input="" output={JSON.stringify(strength, null, 2)} onInputChange={() => {}} toolId="password-strength" singlePanel showCopyMinified={false}>
      <div className="max-w-md space-y-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Password</label>
          <div className="flex gap-2">
            <input
              type={showPwd ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check"
              className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
            />
            <button type="button" onClick={() => setShowPwd(!showPwd)} className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]">
              {showPwd ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        {password && (
          <div className="space-y-2">
            <div className="flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className={`h-2 flex-1 rounded ${i < strength.score ? 'bg-[var(--accent)]' : 'bg-[var(--bg-secondary)]'}`} />
              ))}
            </div>
            <p className={`font-medium ${strength.color}`}>{strength.label}</p>
            <ul className="text-sm text-[var(--text-secondary)] list-disc list-inside">
              {strength.feedback.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
