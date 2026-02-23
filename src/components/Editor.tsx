import { useCallback } from 'react';
import EditorMonaco from '@monaco-editor/react';
import { useTheme } from '../hooks/useTheme';

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  height?: string;
  readOnly?: boolean;
}

export function Editor({ value, onChange, language = 'plaintext', height = '300px', readOnly = false }: EditorProps) {
  const { theme } = useTheme();
  const handleChange = useCallback(
    (val: string | undefined) => onChange(val ?? ''),
    [onChange]
  );

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--border)]">
      <EditorMonaco
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        theme={theme === 'dark' ? 'vs-dark' : 'vs'}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          padding: { top: 12 },
        }}
      />
    </div>
  );
}
