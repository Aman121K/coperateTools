import { useState, useEffect } from 'react';

interface NumberInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  value: number;
  onChange: (n: number) => void;
}

/**
 * Number input that shows empty string when cleared instead of "0".
 */
export function NumberInput({ value, onChange, ...rest }: NumberInputProps) {
  const [str, setStr] = useState(value === 0 ? '' : String(value));

  useEffect(() => {
    const next = value === 0 ? '' : String(value);
    const parsed = parseFloat(str);
    const isTypingDecimal = str.endsWith('.') || (str.includes('.') && !isNaN(parsed) && parsed === value);
    if (next !== str && !isTypingDecimal) setStr(next);
  }, [value, str]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9.]/g, '');
    setStr(v);
    const n = parseFloat(v);
    onChange(isNaN(n) ? 0 : n);
  };

  return <input type="text" inputMode="decimal" value={str} onChange={handleChange} {...rest} />;
}
