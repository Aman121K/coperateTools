import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { ToolLayout } from '../../components/ToolLayout';

const MAX_MB = 100;

const AUDIO_PRESETS: { label: string; from: string[]; to: string; ffmpeg: string[] }[] = [
  { label: 'M4A → MP3', from: ['.m4a', '.aac'], to: 'mp3', ffmpeg: ['-i', 'input', '-q:a', '0', '-map', 'a', 'output.mp3'] },
  { label: 'WAV → MP3', from: ['.wav'], to: 'mp3', ffmpeg: ['-i', 'input', '-q:a', '0', '-map', 'a', 'output.mp3'] },
  { label: 'OGG → MP3', from: ['.ogg'], to: 'mp3', ffmpeg: ['-i', 'input', '-q:a', '0', '-map', 'a', 'output.mp3'] },
  { label: 'AAC → MP3', from: ['.aac'], to: 'mp3', ffmpeg: ['-i', 'input', '-q:a', '0', '-map', 'a', 'output.mp3'] },
];

function detectPreset(filename: string) {
  const ext = filename.match(/\.[^.]+$/)?.[0]?.toLowerCase() || '';
  return AUDIO_PRESETS.find((p) => p.from.some((e) => e.toLowerCase() === ext)) ?? AUDIO_PRESETS[0];
}

export function AudioConvert() {
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
    if (!f.type.startsWith('audio/') && !f.name.match(/\.(m4a|wav|ogg|aac|flac|aiff)$/i)) {
      setError('Please select an audio file (M4A, WAV, OGG, AAC, etc.)');
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
    const preset = detectPreset(file.name);
    const ext = file.name.match(/\.[^.]+$/)?.[0] || '.m4a';

    try {
      ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.round((p ?? 0) * 100)));
      await ffmpeg.load();
      const inputName = 'input' + ext;
      const cmd = preset.ffmpeg.map((arg) => (arg === 'input' ? inputName : arg));

      await ffmpeg.writeFile(inputName, await fetchFile(file));
      await ffmpeg.exec(cmd);
      const data = await ffmpeg.readFile('output.mp3');
      setOutput(new Blob([data as BlobPart], { type: 'audio/mpeg' }));

      await ffmpeg.deleteFile(inputName);
      await ffmpeg.deleteFile('output.mp3');
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
    a.download = file.name.replace(/\.[^.]+$/, '') + '.mp3';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const preset = file ? detectPreset(file.name) : null;

  return (
    <ToolLayout
      title="Audio Converter (M4A, WAV → MP3)"
      description="Convert M4A, WAV, OGG, AAC to MP3. Purpose: Compatibility, smaller file size, or universal playback."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="audio-convert"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload M4A, WAV, OGG, or AAC. Converts to MP3. Max {MAX_MB}MB. Uses FFmpeg.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="audio/*,.m4a,.wav,.ogg,.aac,.flac"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)]"
        >
          {file ? `${file.name} → ${preset?.to ?? 'MP3'}` : 'Select audio'}
        </button>
        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        <button
          type="button"
          onClick={convert}
          disabled={!file || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? `Converting… ${progress}%` : 'Convert to MP3'}
        </button>
        {loading && (
          <div className="h-2 rounded-full bg-[var(--bg-tertiary)] overflow-hidden">
            <div className="h-full bg-[var(--accent)] transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        {output && (
          <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
            <button type="button" onClick={download} className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium">
              Download MP3
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
