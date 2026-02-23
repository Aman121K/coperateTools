import { useState, useRef, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

export function MakeColorTransparent() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [tolerance, setTolerance] = useState(30);
  const [pickedColor, setPickedColor] = useState<{ r: number; g: number; b: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    setFile(f ?? null);
    setResult(null);
    setPickedColor(null);
    setError('');
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    const img = imgRef.current;
    if (!img || !img.complete || !file) return;
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const x = Math.floor((e.clientX - rect.left) * scaleX);
    const y = Math.floor((e.clientY - rect.top) * scaleY);
    const canvas = document.createElement('canvas');
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(img, 0, 0);
    const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
    setPickedColor({ r, g, b });
  };

  const process = async () => {
    if (!file || !pickedColor) return;
    setLoading(true);
    setError('');
    setResult(null);
    try {
      const img = await createImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { r, g, b } = pickedColor;
      const tol = tolerance / 100;

      for (let i = 0; i < data.data.length; i += 4) {
        const dr = (data.data[i] - r) / 255;
        const dg = (data.data[i + 1] - g) / 255;
        const db = (data.data[i + 2] - b) / 255;
        const dist = Math.sqrt(dr * dr + dg * dg + db * db);
        if (dist <= tol) data.data[i + 3] = 0;
      }
      ctx.putImageData(data, 0, 0, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        if (blob) setResult(blob);
      }, 'image/png');
    } catch (e) {
      setError((e as Error).message || 'Processing failed');
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(result);
    a.download = (file?.name.replace(/\.[^.]+$/, '') || 'image') + '-transparent.png';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <ToolLayout
      title="Make Color Transparent"
      description="Pick a color to make transparent. Purpose: Logos, simple graphics, or removing solid backgrounds."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="make-color-transparent"
      singlePanel
      showCopyMinified={false}
    >
      <div className="max-w-lg space-y-6">
        <p className="text-sm text-[var(--text-muted)]">
          Upload an image, click to pick the color to remove, then process. Adjust tolerance for similar colors.
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFile}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full px-4 py-6 rounded-[var(--radius)] border-2 border-dashed border-[var(--border)] hover:border-[var(--accent)]/50 text-[var(--text-secondary)]"
        >
          {file ? file.name : 'Select image'}
        </button>

        {file && (
          <>
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[var(--text-secondary)]">Click image to pick color</label>
              <img
                ref={imgRef}
                src={previewUrl || ''}
                alt="Preview"
                onClick={handleImageClick}
                className="max-w-full max-h-64 rounded-[var(--radius-sm)] border border-[var(--border)] cursor-crosshair bg-[var(--bg-tertiary)] object-contain"
              />
              {pickedColor && (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-[var(--border)]"
                    style={{ backgroundColor: `rgb(${pickedColor.r},${pickedColor.g},${pickedColor.b})` }}
                  />
                  <span className="text-sm text-[var(--text-muted)]">
                    rgb({pickedColor.r}, {pickedColor.g}, {pickedColor.b})
                  </span>
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Tolerance: {tolerance}%</label>
              <input
                type="range"
                min={1}
                max={100}
                value={tolerance}
                onChange={(e) => setTolerance(parseInt(e.target.value, 10))}
                className="w-full"
              />
            </div>
          </>
        )}

        {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
        <button
          type="button"
          onClick={process}
          disabled={!file || !pickedColor || loading}
          className="w-full py-3 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-50 text-white font-medium"
        >
          {loading ? 'Processing...' : 'Make Transparent'}
        </button>
        {result && (
          <div className="space-y-4">
            <div>
              <p className="text-xs text-[var(--text-muted)] mb-1">Result (checkerboard = transparent)</p>
              <img
                src={URL.createObjectURL(result)}
                alt="Result"
                className="max-h-48 rounded-[var(--radius-sm)] border border-[var(--border)] bg-[repeating-conic-gradient(#80808020_0%_25%,transparent_0%_50%)_50%/20px_20px]"
              />
            </div>
            <button
              type="button"
              onClick={download}
              className="px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-medium"
            >
              Download PNG
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
