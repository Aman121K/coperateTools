import { useState, useRef } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { ToolLayout } from '../../components/ToolLayout';

const MAX_AUDIO_MB = 50;
const MAX_IMAGE_MB = 10;

export function Mp3ToMp4() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [output, setOutput] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  const handleAudio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setOutput(null);
    setError(null);
    if (!f) {
      setAudioFile(null);
      return;
    }
    if (!f.type.startsWith('audio/') && !f.name.match(/\.(mp3|wav|m4a|ogg|aac)$/i)) {
      setError('Please select an audio file (MP3, WAV, M4A, etc.)');
      return;
    }
    if (f.size > MAX_AUDIO_MB * 1024 * 1024) {
      setError(`Audio too large. Max ${MAX_AUDIO_MB}MB.`);
      return;
    }
    setAudioFile(f);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setOutput(null);
    setError(null);
    if (!f) {
      setImageFile(null);
      return;
    }
    if (!f.type.startsWith('image/')) {
      setError('Please select an image (JPG, PNG, etc.)');
      return;
    }
    if (f.size > MAX_IMAGE_MB * 1024 * 1024) {
      setError(`Image too large. Max ${MAX_IMAGE_MB}MB.`);
      return;
    }
    setImageFile(f);
  };

  const convert = async () => {
    if (!audioFile || !imageFile) return;
    setLoading(true);
    setError(null);
    setProgress(0);
    const ffmpeg = new FFmpeg();

    try {
      ffmpeg.on('progress', ({ progress: p }) => setProgress(Math.round((p ?? 0) * 100)));
      await ffmpeg.load();

      const audioExt = audioFile.name.match(/\.[^.]+$/)?.[0] || '.mp3';
      const imageExt = imageFile.name.match(/\.[^.]+$/)?.[0] || '.jpg';

      await ffmpeg.writeFile('audio' + audioExt, await fetchFile(audioFile));
      await ffmpeg.writeFile('image' + imageExt, await fetchFile(imageFile));

      await ffmpeg.exec([
        '-loop', '1', '-i', 'image' + imageExt,
        '-i', 'audio' + audioExt,
        '-c:v', 'mpeg4', '-q:v', '5',
        '-c:a', 'aac', '-b:a', '192k', '-shortest',
        '-pix_fmt', 'yuv420p',
        'output.mp4',
      ]);

      const data = await ffmpeg.readFile('output.mp4');
      setOutput(new Blob([data as BlobPart], { type: 'video/mp4' }));

      await ffmpeg.deleteFile('audio' + audioExt);
      await ffmpeg.deleteFile('image' + imageExt);
      await ffmpeg.deleteFile('output.mp4');
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
    if (!output || !audioFile) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(output);
    a.download = audioFile.name.replace(/\.[^.]+$/, '') + '.mp4';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const ready = audioFile && imageFile;

  return (
    <ToolLayout
      title="MP3 → MP4"
      description="Create video from audio + image. Purpose: Add album art to audio, create lyric videos, or social clips. Uses FFmpeg.wasm."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="mp3-mp4"
      singlePanel
      showCopyMinified={false}
      shareData={{ audio: audioFile?.name, image: imageFile?.name }}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload audio + optional image to create a video. Image is shown as static background. Max {MAX_AUDIO_MB}MB audio, {MAX_IMAGE_MB}MB image.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Audio (MP3, WAV, etc.)</label>
            <input
              ref={audioRef}
              type="file"
              accept="audio/*,.mp3,.wav,.m4a,.ogg,.aac"
              onChange={handleAudio}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => audioRef.current?.click()}
              className="w-full px-4 py-4 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)] text-sm"
            >
              {audioFile ? audioFile.name : 'Select audio'}
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Image (JPG, PNG)</label>
            <input
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={handleImage}
              className="hidden"
            />
            <button
              type="button"
              onClick={() => imageRef.current?.click()}
              className="w-full px-4 py-4 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)] text-sm"
            >
              {imageFile ? imageFile.name : 'Select image'}
            </button>
          </div>
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <button
          type="button"
          onClick={convert}
          disabled={!ready || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? `Converting… ${progress}%` : 'Create MP4'}
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
              Download MP4
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
