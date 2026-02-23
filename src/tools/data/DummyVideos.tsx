import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

const VIDEO_URLS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
];

export function DummyVideos() {
  const [selected, setSelected] = useState(0);
  const output = VIDEO_URLS.join('\n');

  return (
    <ToolLayout
      title="Dummy Video URLs"
      description="Sample video URLs for testing. Purpose: Test video players or layouts without hosting your own files."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="dummy-videos"
      singlePanel
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Preview</label>
            <div className="rounded-lg overflow-hidden border border-[var(--border)] bg-black">
              <video
                key={VIDEO_URLS[selected]}
                src={VIDEO_URLS[selected]}
                controls
                className="w-full max-h-[400px]"
              />
            </div>
            <p className="mt-2 text-sm text-[var(--text-secondary)] truncate">{VIDEO_URLS[selected]}</p>
          </div>
          <div>
            <label className="block text-sm text-[var(--text-secondary)] mb-2">Video list</label>
            <ul className="space-y-1 max-h-[300px] overflow-y-auto">
              {VIDEO_URLS.map((url, i) => (
                <li key={i}>
                  <button
                    onClick={() => setSelected(i)}
                    className={`w-full text-left px-3 py-2 rounded text-sm truncate ${
                      i === selected ? 'bg-[var(--accent)]/20' : 'hover:bg-[var(--bg-tertiary)]'
                    }`}
                  >
                    {url.split('/').pop()}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4">
              <label className="block text-sm text-[var(--text-secondary)] mb-2">All URLs</label>
              <Editor value={output} onChange={() => {}} language="plaintext" height="150px" readOnly />
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
