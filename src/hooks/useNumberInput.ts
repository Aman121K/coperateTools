import { useState, useCallback } from 'react';

/**
 * Hook for number inputs that show empty string when cleared instead of "0".
 * Returns [displayValue, numericValue, setValue] where setValue accepts string or number.
 */
export function useNumberInput(initial: number): [string, number, (v: string | number) => void] {
  const [str, setStr] = useState(initial === 0 ? '' : String(initial));

  const setValue = useCallback((v: string | number) => {
    if (typeof v === 'number') {
      setStr(v === 0 ? '' : String(v));
    } else {
      const cleaned = v.replace(/[^0-9.]/g, '');
      setStr(cleaned);
    }
  }, []);

  const num = str === '' ? 0 : parseFloat(str);
  const displayValue = str;

  return [displayValue, isNaN(num) ? 0 : num, setValue];
}
