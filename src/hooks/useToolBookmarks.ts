import { useCallback, useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'devtool-bookmarked-tools';

function parseIds(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
}

export function useToolBookmarks() {
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    return parseIds(localStorage.getItem(STORAGE_KEY));
  });

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        setBookmarkedIds(parseIds(event.newValue));
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const persist = useCallback((nextIds: string[]) => {
    setBookmarkedIds(nextIds);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextIds));
  }, []);

  const isBookmarked = useCallback(
    (toolId: string) => bookmarkedIds.includes(toolId),
    [bookmarkedIds]
  );

  const toggleBookmark = useCallback(
    (toolId: string) => {
      if (isBookmarked(toolId)) {
        persist(bookmarkedIds.filter((id) => id !== toolId));
        return;
      }
      persist([toolId, ...bookmarkedIds]);
    },
    [bookmarkedIds, isBookmarked, persist]
  );

  const bookmarkedIdSet = useMemo(() => new Set(bookmarkedIds), [bookmarkedIds]);

  return {
    bookmarkedIds,
    bookmarkedIdSet,
    isBookmarked,
    toggleBookmark,
  };
}
