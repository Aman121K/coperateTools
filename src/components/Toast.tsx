import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-[100] px-4 py-3 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border)] shadow-lg flex items-center gap-2 animate-in"
    >
      <span className="text-green-500">✓</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">{message}</span>
    </div>
  );
}
