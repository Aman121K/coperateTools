import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';
import type { Area } from 'react-easy-crop';
import 'react-easy-crop/react-easy-crop.css';
import { ToolLayout } from '../../components/ToolLayout';

type OutputFormat = 'image/jpeg' | 'image/png' | 'image/webp';
const ASPECT_RATIOS = [
  { label: 'Free', value: '' },
  { label: '1:1', value: '1' },
  { label: '16:9', value: String(16 / 9) },
  { label: '4:3', value: String(4 / 3) },
  { label: '3:2', value: String(3 / 2) },
  { label: '9:16', value: String(9 / 16) },
];

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

async function getCroppedImg(
  src: string,
  crop: Area,
  width?: number,
  height?: number,
  format: OutputFormat = 'image/jpeg',
  quality = 0.9
): Promise<Blob> {
  const img = await createImage(src);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d')!;

  const outW = width ?? crop.width;
  const outH = height ?? crop.height;
  canvas.width = outW;
  canvas.height = outH;

  ctx.drawImage(
    img,
    crop.x, crop.y, crop.width, crop.height,
    0, 0, outW, outH
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob!), format, quality);
  });
}

export function ImageResizer() {
  const [src, setSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedArea, setCroppedArea] = useState<Area | null>(null);
  const [aspectRatio, setAspectRatio] = useState('');
  const [resizeW, setResizeW] = useState('');
  const [resizeH, setResizeH] = useState('');
  const [keepAspect, setKeepAspect] = useState(true);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('image/jpeg');
  const [result, setResult] = useState<Blob | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback((_: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  }, []);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setSrc(URL.createObjectURL(file));
      setResult(null);
      setResizeW('');
      setResizeH('');
    }
  };

  const handleExport = async () => {
    if (!src || !croppedArea) return;
    const w = resizeW ? parseInt(resizeW, 10) : undefined;
    const h = resizeH ? parseInt(resizeH, 10) : undefined;
    const blob = await getCroppedImg(src, croppedArea, w, h, outputFormat);
    setResult(blob);
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(result);
    a.download = `resized.${outputFormat.split('/')[1]}`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const aspect = aspectRatio && !Number.isNaN(parseFloat(aspectRatio)) ? parseFloat(aspectRatio) : 4 / 3;

  const handleRestoreFromShare = useCallback((data: Record<string, unknown>) => {
    if (typeof data.aspectRatio === 'string') setAspectRatio(data.aspectRatio);
    if (typeof data.resizeW === 'string') setResizeW(data.resizeW);
    if (typeof data.resizeH === 'string') setResizeH(data.resizeH);
    if (typeof data.keepAspect === 'boolean') setKeepAspect(data.keepAspect);
    if (typeof data.outputFormat === 'string') setOutputFormat(data.outputFormat as OutputFormat);
  }, []);

  return (
    <ToolLayout
      title="Image Resizer / Cropper"
      description="Resize and crop images with presets. Purpose: Adapt images for thumbnails, social posts, or specific dimensions."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="image-resizer"
      singlePanel
      showCopyMinified={false}
      shareData={{ aspectRatio, resizeW, resizeH, keepAspect, outputFormat }}
      onRestoreFromShare={handleRestoreFromShare}
    >
      <div className="space-y-6">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            className="block w-full text-sm text-[var(--text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-[var(--radius-sm)] file:border-0 file:bg-[var(--accent)] file:text-white file:cursor-pointer"
          />
        </div>

        {src && (
          <>
            <div className="flex flex-wrap gap-4 items-center p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Crop ratio</label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value)}
                  className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                >
                  {ASPECT_RATIOS.map((r) => (
                    <option key={r.label} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Resize W</label>
                <input
                  type="number"
                  placeholder="auto"
                  value={resizeW}
                  onChange={(e) => {
                    setResizeW(e.target.value);
                    if (keepAspect && resizeH) setResizeH('');
                  }}
                  className="w-24 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Resize H</label>
                <input
                  type="number"
                  placeholder="auto"
                  value={resizeH}
                  onChange={(e) => setResizeH(e.target.value)}
                  className="w-24 px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={keepAspect}
                  onChange={(e) => setKeepAspect(e.target.checked)}
                />
                <span className="text-sm">Keep aspect</span>
              </label>
              <div>
                <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Format</label>
                <select
                  value={outputFormat}
                  onChange={(e) => setOutputFormat(e.target.value as OutputFormat)}
                  className="px-3 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                >
                  <option value="image/jpeg">JPG</option>
                  <option value="image/png">PNG</option>
                  <option value="image/webp">WebP</option>
                </select>
              </div>
              <div className="self-end">
                <button
                  type="button"
                  onClick={handleExport}
                  className="px-5 py-2.5 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
                >
                  Export
                </button>
              </div>
            </div>

            <div className="relative w-full min-w-0 h-[400px] rounded-[var(--radius)] overflow-hidden bg-[var(--bg-tertiary)] border border-[var(--border)]">
              <Cropper
                image={src}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                objectFit="cover"
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="w-48"
              />
            </div>

            {result && (
              <div className="flex items-center gap-4 p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
                <img
                  src={URL.createObjectURL(result)}
                  alt="Result"
                  className="max-h-32 rounded-[var(--radius-sm)] border border-[var(--border)]"
                />
                <div>
                  <p className="text-sm font-medium">Preview ready</p>
                  <button
                    type="button"
                    onClick={download}
                    className="mt-2 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white text-sm"
                  >
                    Download
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </ToolLayout>
  );
}
