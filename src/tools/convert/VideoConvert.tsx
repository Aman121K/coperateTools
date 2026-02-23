import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { ToolLayout } from '../../components/ToolLayout';

const MAX_MB = 100;

export function VideoConvert() {
  const [file, setFile] = useState<File | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setOutput(null);
    setError(null);
    if (!f) {
      setFile(null);
      return;
    }
    if (!f.type.startsWith('video/') && !f.name.match(/\.(mkv|mov|avi|webm|wmv|flv)$/i)) {
      setError('Please select a video file (MKV, MOV, AVI, WebM, etc.)');
      return;
    }
    if (f.size > MAX_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_MB}MB.`);
      return;
    }
    setFile(f);
  };

  const convert = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    const ffmpeg = new FFmpeg();
    const ext = file.name.match(/\.[^.]+$/)?.[0] || '.mkv';

    try {
      ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.round((p ?? 0) * 100)));
      await ffmpeg.load();
      const inputName = 'input' + ext;

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec([
        '-i', inputName,
        '-c:v', 'libx264', '-preset', 'fast', '-crf', '23',
        '-c:a', 'aac', '-b:a', '192k',
        '-movflags', '+faststart',
        'output.mp4',
      ]);
      const data = await ffmpeg.readFile('output.mp4');
      setOutput(new Blob([data as BlobPart], { type: 'video/mp4' }));

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile('output.mp4');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('SharedArrayBuffer') || msg.includes('cross-origin')) {
        setError('FFmpeg needs secure context. Run via npm run dev or serve with COOP/COEP headers.');
      } else {
        setError(msg || 'Conversion failed');
      }
    } finally {
      setLoading(false);
      setProgress(0);
      ffmpeg.terminate();
    }
  };

  const download = () => {
    if (!output || !file) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(output);
    a.download = file.name.replace(/\.[^.]+$/, '') + '.mp4';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout
      title="Video Converter (MKV, MOV → MP4)"
      description="Convert MKV, MOV, AVI, WebM to MP4. Purpose: Compatibility, streaming, or smaller file size."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="video-convert"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload MKV, MOV, AVI, or WebM. Converts to MP4. Max {MAX_MB}MB. Uses FFmpeg.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="video/*,.mkv,.mov,.avi,.webm,.wmv,.flv"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)]"
        >
          {file ? `${file.name} → MP4` : 'Select video'}
        </button>
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        <button
          type="button"
          onClick={convert}
          disabled={!file || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? `Converting… ${progress}%` : 'Convert to MP4'}
        </button>
        {loading && (
          <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {output && (
          <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <button type="button" onClick={download} className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium">
              Download MP4
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
