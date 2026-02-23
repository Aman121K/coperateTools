import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = hex.replace(/^#/, '').match(/^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i);
  if (!m) return null;
  return { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) };
}

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((x) => Math.round(Math.max(0, Math.min(255, x))).toString(16).padStart(2, '0')).join('');
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
    else if (max === g) h = ((b - r) / d + 2) / 6;
    else h = ((r - g) / d + 4) / 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) r = g = b = l;
  else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  return { r: r * 255, g: g * 255, b: b * 255 };
}

export function ColorConverter() {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState({ r: 99, g: 102, b: 241 });
  const [hsl, setHsl] = useState({ h: 238, s: 87, l: 67 });
  const syncFromRgb = (r: number, g: number, b: number) => {
    setHex(rgbToHex(r, g, b));
    const hslVal = rgbToHsl(r, g, b);
    setHsl(hslVal);
  };

  const syncFromHsl = (h: number, s: number, l: number) => {
    const rgbVal = hslToRgb(h, s, l);
    setRgb(rgbVal);
    setHex(rgbToHex(rgbVal.r, rgbVal.g, rgbVal.b));
  };

  const handleHexChange = (v: string) => {
    setHex(v);
    const rgbVal = hexToRgb(v);
    if (rgbVal) {
      setRgb(rgbVal);
      setHsl(rgbToHsl(rgbVal.r, rgbVal.g, rgbVal.b));
    }
  };

  const handleRgbChange = (key: 'r' | 'g' | 'b', val: number) => {
    const next = { ...rgb, [key]: Math.max(0, Math.min(255, val)) };
    setRgb(next);
    syncFromRgb(next.r, next.g, next.b);
  };

  const handleHslChange = (key: 'h' | 's' | 'l', val: number) => {
    const next = { ...hsl, [key]: Math.max(0, Math.min(key === 'h' ? 360 : 100, val)) };
    setHsl(next);
    syncFromHsl(next.h, next.s, next.l);
  };

  const output = `HEX: ${hex}\nRGB: rgb(${rgb.r}, ${rgb.g}, ${rgb.b})\nHSL: hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;

  return (
    <ToolLayout
      title="Color Converter"
      description="Convert between HEX, RGB, HSL. Purpose: Design tokens, CSS variables, or color picker integration."
      input=""
      output={output}
      onInputChange={() => {}}
      toolId="color-converter"
      singlePanel
      showCopyMinified={false}
      shareData={{ hex, rgb, hsl }}
      onRestoreFromShare={(d) => {
        if (typeof d.hex === 'string') handleHexChange(d.hex);
        if (d.rgb && typeof d.rgb === 'object') {
          const r = (d.rgb as Record<string, number>).r;
          const g = (d.rgb as Record<string, number>).g;
          const b = (d.rgb as Record<string, number>).b;
          if (typeof r === 'number' && typeof g === 'number' && typeof b === 'number') {
            setRgb({ r, g, b });
            syncFromRgb(r, g, b);
          }
        }
      }}
    >
      <div className="max-w-lg space-y-6">
        <div className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)] space-y-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">HEX</label>
            <div className="flex gap-2 items-center">
              <input
                type="color"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer border border-[var(--border)]"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => handleHexChange(e.target.value)}
                className="flex-1 px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)] font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">RGB</label>
            <div className="flex gap-2">
              {(['r', 'g', 'b'] as const).map((k) => (
                <div key={k} className="flex-1">
                  <input
                    type="number"
                    min={0}
                    max={255}
                    value={rgb[k]}
                    onChange={(e) => handleRgbChange(k, parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                  />
                  <span className="text-xs text-[var(--text-muted)] ml-1 uppercase">{k}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-[var(--text-muted)] mb-1">HSL</label>
            <div className="flex gap-2">
              {(['h', 's', 'l'] as const).map((k) => (
                <div key={k} className="flex-1">
                  <input
                    type="number"
                    min={0}
                    max={k === 'h' ? 360 : 100}
                    value={Math.round(hsl[k])}
                    onChange={(e) => handleHslChange(k, parseInt(e.target.value, 10) || 0)}
                    className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-secondary)] border border-[var(--border)]"
                  />
                  <span className="text-xs text-[var(--text-muted)] ml-1 uppercase">{k}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="p-6 rounded-[var(--radius)] border-2 border-[var(--border)]" style={{ backgroundColor: hex }}>
          <p className="text-sm text-[var(--text-muted)]">Preview</p>
        </div>
      </div>
    </ToolLayout>
  );
}
