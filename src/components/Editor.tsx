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

  const isFillHeight = height === '100%';

  return (
    <div className={`rounded-lg overflow-hidden border border-[var(--border)] ${isFillHeight ? 'flex-1 min-h-0 flex flex-col' : ''}`}>
      {isFillHeight ? (
        <div className="flex-1 min-h-0">
          <EditorMonaco
            height="100%"
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
      ) : (
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
      )}
    </div>
  );
}
