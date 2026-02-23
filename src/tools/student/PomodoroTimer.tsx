import { useState, useEffect, useRef } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

const WORK_MIN = 25;
const BREAK_MIN = 5;

export function PomodoroTimer() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [secondsLeft, setSecondsLeft] = useState(WORK_MIN * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setIsRunning(false);
            setMode((m) => (m === 'work' ? 'break' : 'work'));
            return (mode === 'work' ? BREAK_MIN : WORK_MIN) * 60;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);

  const reset = () => {
    setIsRunning(false);
    setSecondsLeft((mode === 'work' ? WORK_MIN : BREAK_MIN) * 60);
  };

  const switchMode = () => {
    setIsRunning(false);
    const next = mode === 'work' ? 'break' : 'work';
    setMode(next);
    setSecondsLeft((next === 'work' ? WORK_MIN : BREAK_MIN) * 60);
  };

  const m = Math.floor(secondsLeft / 60);
  const s = secondsLeft % 60;

  return (
    <ToolLayout title="Pomodoro Timer" description="25 min focus, 5 min break. Purpose: Stay focused during study sessions with timed work and rest intervals." input="" output="" onInputChange={() => {}} toolId="pomodoro-timer" singlePanel showCopyMinified={false}>
      <div className="max-w-md mx-auto text-center space-y-6">
        <div className="flex justify-center gap-2">
          <button type="button" onClick={() => { setMode('work'); setSecondsLeft(WORK_MIN * 60); setIsRunning(false); }} className={`px-4 py-2 rounded-[var(--radius-sm)] ${mode === 'work' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)]'}`}>Work</button>
          <button type="button" onClick={() => { setMode('break'); setSecondsLeft(BREAK_MIN * 60); setIsRunning(false); }} className={`px-4 py-2 rounded-[var(--radius-sm)] ${mode === 'break' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-tertiary)]'}`}>Break</button>
        </div>
        <div className={`p-12 rounded-full border-4 ${mode === 'work' ? 'border-[var(--accent)]' : 'border-[var(--success)]'}`}>
          <p className="text-5xl font-bold font-mono">{String(m).padStart(2, '0')}:{String(s).padStart(2, '0')}</p>
          <p className="text-sm text-[var(--text-muted)] mt-2">{mode === 'work' ? 'Focus time' : 'Break time'}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button type="button" onClick={() => setIsRunning(!isRunning)} className="px-8 py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium">
            {isRunning ? 'Pause' : 'Start'}
          </button>
          <button type="button" onClick={reset} className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">Reset</button>
          <button type="button" onClick={switchMode} className="px-6 py-3 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">Switch</button>
        </div>
      </div>
    </ToolLayout>
  );
}
