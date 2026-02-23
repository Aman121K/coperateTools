import { useState } from 'react';
import { faker } from '@faker-js/faker';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function DummyImages() {
  const [count, setCount] = useState(6);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [urls, setUrls] = useState<string[]>([]);

  const generate = () => {
    const list = Array.from({ length: Math.min(count, 20) }, () =>
      faker.image.url({ width, height })
    );
    setUrls(list);
  };

  const output = urls.join('\n');

  return (
    <ToolLayout
      title="Dummy Image URLs"
      description="Generate placeholder image URLs. Purpose: Use in layouts or tests without real image assets."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="dummy-images"
      singlePanel
    >
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">Count:</span>
            <input
              type="number"
              min={1}
              max={20}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
              className="w-20 px-2 py-1.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border)]"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">W:</span>
            <input
              type="number"
              min={100}
              max={1920}
              value={width}
              onChange={(e) => setWidth(parseInt(e.target.value, 10) || 200)}
              className="w-20 px-2 py-1.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border)]"
            />
          </label>
          <label className="flex items-center gap-2">
            <span className="text-sm text-[var(--text-secondary)]">H:</span>
            <input
              type="number"
              min={100}
              max={1080}
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value, 10) || 200)}
              className="w-20 px-2 py-1.5 rounded bg-[var(--bg-tertiary)] border border-[var(--border)]"
            />
          </label>
          <button
            onClick={generate}
            className="px-4 py-2 rounded-md bg-[var(--accent)] hover:bg-[var(--accent-hover)]"
          >
            Generate
          </button>
        </div>
        {urls.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {urls.map((url, i) => (
                <div key={i} className="rounded-lg overflow-hidden border border-[var(--border)]">
                  <img src={url} alt="" className="w-full h-32 object-cover" />
                  <p className="p-2 text-xs truncate text-[var(--text-secondary)]">{url}</p>
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm text-[var(--text-secondary)] mb-2">URLs (one per line)</label>
              <Editor value={output} onChange={() => {}} language="plaintext" height="150px" readOnly />
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
