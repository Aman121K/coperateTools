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
      className="fixed bottom-6 right-6 z-[100] max-w-sm px-4 py-3 rounded-xl bg-[var(--bg-elevated)]/95 border border-[var(--border)] shadow-[var(--shadow-elevated)] flex items-center gap-2 animate-in backdrop-blur"
    >
      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--success)]/15 text-[var(--success)]">✓</span>
      <span className="text-sm font-medium text-[var(--text-primary)]">{message}</span>
    </div>
  );
}
