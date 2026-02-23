import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { ToolLayout } from '../../components/ToolLayout';

const MAX_SIZE_MB = 100;

export function Mp4ToMp3() {
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
    if (!f.type.startsWith('video/') && !f.name.match(/\.(mp4|webm|mov|avi|mkv)$/i)) {
      setError('Please select a video file (MP4, WebM, MOV, AVI, MKV)');
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Max ${MAX_SIZE_MB}MB for browser processing.`);
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

    try {
      ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.round((p ?? 0) * 100)));
      await ffmpeg.load();
      const inputName = 'input' + (file.name.match(/\.[^.]+$/)?.[0] || '.mp4');

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(['-i', inputName, '-q:a', '0', '-map', 'a', 'output.mp3']);
      const data = await ffmpeg.readFile('output.mp3');
      setOutput(new Blob([data as BlobPart], { type: 'audio/mpeg' }));

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile('output.mp3');
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      if (msg.includes('SharedArrayBuffer') || msg.includes('cross-origin')) {
        setError('FFmpeg needs secure context. Run via npm run dev or serve with COOP/COEP headers. See README.');
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
    a.download = file.name.replace(/\.[^.]+$/, '') + '.mp3';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout
      title="MP4 → MP3"
      description="Extract audio from video. Purpose: Get podcast audio, remove video track, or create ringtones. Uses FFmpeg.wasm in browser."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="mp4-mp3"
      singlePanel
      showCopyMinified={false}
      shareData={{ file: file?.name }}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload a video file (MP4, WebM, MOV, etc.) to extract audio as MP3. Max {MAX_SIZE_MB}MB. Runs in browser — no server.
        </p>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="video/*,.mp4,.webm,.mov,.avi,.mkv"
            onChange={handleFile}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="w-full px-4 py-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {file ? file.name : 'Click to select video'}
          </button>
          {file && <p className="mt-1 text-xs text-[var(--text-muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="button"
          onClick={convert}
          disabled={!file || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? `Converting… ${progress}%` : 'Extract to MP3'}
        </button>
        {loading && (
          <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {output && (
          <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <p className="text-sm text-[var(--text-muted)] mb-2">Ready to download</p>
            <button
              type="button"
              onClick={download}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
            >
              Download MP3
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
