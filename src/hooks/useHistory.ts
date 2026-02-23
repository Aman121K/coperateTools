import { useState, useEffect, useCallback } from 'react';
import type { HistoryItem } from '../types';

const STORAGE_KEY = 'devtool-history';
const MAX_ITEMS = 50;

export function useHistory(toolId?: string) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = stored ? JSON.parse(stored) : [];
      setHistory(Array.isArray(parsed) ? parsed : []);
    } catch {
      setHistory([]);
    }
  }, []);

  const add = useCallback((item: Omit<HistoryItem, 'id' | 'timestamp'>) => {
    const newItem: HistoryItem = {
      ...item,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    setHistory((prev) => {
      const filtered = prev.filter((h) => h.toolId !== item.toolId || h.input !== item.input);
      const next = [newItem, ...filtered].slice(0, MAX_ITEMS);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const clear = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const toolHistory = toolId ? history.filter((h) => h.toolId === toolId).slice(0, 10) : [];

  return { history, add, clear, toolHistory };
}
