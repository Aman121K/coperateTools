import { NavLink } from 'react-router-dom';
import { ToolLayout } from '../../components/ToolLayout';

type ConversionItem = {
  id: string;
  label: string;
  path: string;
};

const DOCUMENT_CONVERSIONS: ConversionItem[] = [
  { id: 'pdf-jpg', label: 'PDF to JPG', path: '/tools/media/pdf-images' },
  { id: 'pdf-txt', label: 'PDF to TXT', path: '/tools/convert/pdf-txt' },
];

const IMAGE_CONVERSIONS: ConversionItem[] = [
  { id: 'jpg-pdf', label: 'JPG to PDF', path: '/tools/convert/image-pdf' },
  { id: 'png-pdf', label: 'PNG to PDF', path: '/tools/convert/image-pdf' },
  { id: 'png-ico', label: 'PNG to ICO', path: '/tools/convert/png-ico' },
];

const IMAGE_EDITING: ConversionItem[] = [
  { id: 'remove-bg', label: 'Remove Background', path: '/tools/media/remove-bg' },
  { id: 'make-transparent', label: 'Make Color Transparent', path: '/tools/media/make-transparent' },
  { id: 'replace-bg', label: 'Replace Background', path: '/tools/media/replace-bg' },
];

const AUDIO_VIDEO_CONVERSIONS: ConversionItem[] = [
  { id: 'mp4-mp3', label: 'MP4 to MP3', path: '/tools/media/mp4-mp3' },
  { id: 'mp3-mp4', label: 'MP3 to MP4', path: '/tools/media/mp3-mp4' },
  { id: 'm4a-mp3', label: 'M4A to MP3', path: '/tools/convert/audio-convert' },
  { id: 'mkv-mp4', label: 'MKV to MP4', path: '/tools/convert/video-convert' },
  { id: 'mov-mp4', label: 'MOV to MP4', path: '/tools/convert/video-convert' },
  { id: 'wav-mp3', label: 'WAV to MP3', path: '/tools/convert/audio-convert' },
];

function ConversionCard({ item }: { item: ConversionItem }) {
  const content = (
    <div className="flex items-center justify-between gap-2 px-4 py-3 rounded-[var(--radius-sm)] border border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-muted)]/30 transition-colors cursor-pointer">
      <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
      <span className="text-xs text-[var(--accent)]">→</span>
    </div>
  );

  return (
    <NavLink to={item.path} className="block">
      {content}
    </NavLink>
  );
}

function ConversionSection({ title, items }: { title: string; items: ConversionItem[] }) {
  return (
    <section>
      <h3 className="text-sm font-semibold text-[var(--text-secondary)] uppercase tracking-wider mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {items.map((item) => (
          <ConversionCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export function ConversionTool() {
  return (
    <ToolLayout
      title="Conversion Tool"
      description="Convert files between formats. Document, image, and audio/video conversions. Purpose: Format compatibility, archival, or workflow integration."
      input=""
      output=""
      onInputChange={() => {}}
      toolId="conversion-tool"
      singlePanel
      showCopyMinified={false}
    >
      <div className="space-y-8 max-w-5xl">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-secondary)]/50 px-4 py-3">
          <p className="text-sm text-[var(--text-secondary)]">
            Choose a conversion below. All tools run in your browser — your files never leave your device.
          </p>
        </div>
        <ConversionSection title="Document Conversions" items={DOCUMENT_CONVERSIONS} />
        <ConversionSection title="Image Conversions" items={IMAGE_CONVERSIONS} />
        <ConversionSection title="Image Editing (Transparency)" items={IMAGE_EDITING} />
        <ConversionSection title="Audio / Video Conversions" items={AUDIO_VIDEO_CONVERSIONS} />
      </div>
    </ToolLayout>
  );
}
