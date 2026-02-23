import { NavLink } from 'react-router-dom';
import { ToolLayout } from '../../components/ToolLayout';

type ConversionItem = {
  id: string;
  label: string;
  path?: string;
  status: 'available' | 'coming-soon';
};

const DOCUMENT_CONVERSIONS: ConversionItem[] = [
  { id: 'pdf-csv', label: 'PDF to CSV', status: 'coming-soon' },
  { id: 'pdf-jpg', label: 'PDF to JPG', path: '/tools/media/pdf-images', status: 'available' },
  { id: 'docx-jpg', label: 'DOCX to JPG', status: 'coming-soon' },
  { id: 'doc-pdf', label: 'DOC to PDF', status: 'coming-soon' },
  { id: 'dwg-pdf', label: 'DWG to PDF', status: 'coming-soon' },
  { id: 'epub-pdf', label: 'EPUB to PDF', status: 'coming-soon' },
  { id: 'eml-pdf', label: 'EML to PDF', status: 'coming-soon' },
  { id: 'pdf-doc', label: 'PDF to DOC', status: 'coming-soon' },
  { id: 'msg-pdf', label: 'MSG to PDF', status: 'coming-soon' },
  { id: 'pdf-dwg', label: 'PDF to DWG', status: 'coming-soon' },
  { id: 'pdf-dxf', label: 'PDF to DXF', status: 'coming-soon' },
  { id: 'docx-pdf', label: 'DOCX to PDF', status: 'coming-soon' },
  { id: 'pdf-txt', label: 'PDF to TXT', path: '/tools/convert/pdf-txt', status: 'available' },
  { id: 'pdf-docx', label: 'PDF to DOCX', status: 'coming-soon' },
  { id: 'pdf-xls', label: 'PDF to XLS', status: 'coming-soon' },
  { id: 'pdf-xlsx', label: 'PDF to XLSX', status: 'coming-soon' },
  { id: 'pptx-pdf', label: 'PPTX to PDF', status: 'coming-soon' },
  { id: 'pub-pdf', label: 'PUB to PDF', status: 'coming-soon' },
  { id: 'wps-docx', label: 'WPS to DOCX', status: 'coming-soon' },
];

const IMAGE_CONVERSIONS: ConversionItem[] = [
  { id: 'jpg-pdf', label: 'JPG to PDF', path: '/tools/convert/image-pdf', status: 'available' },
  { id: 'png-pdf', label: 'PNG to PDF', path: '/tools/convert/image-pdf', status: 'available' },
  { id: 'png-ico', label: 'PNG to ICO', path: '/tools/convert/png-ico', status: 'available' },
];

const IMAGE_EDITING: ConversionItem[] = [
  { id: 'remove-bg', label: 'Remove Background', path: '/tools/media/remove-bg', status: 'available' },
  { id: 'make-transparent', label: 'Make Color Transparent', path: '/tools/media/make-transparent', status: 'available' },
  { id: 'replace-bg', label: 'Replace Background', path: '/tools/media/replace-bg', status: 'available' },
];

const AUDIO_VIDEO_CONVERSIONS: ConversionItem[] = [
  { id: 'mp4-mp3', label: 'MP4 to MP3', path: '/tools/media/mp4-mp3', status: 'available' },
  { id: 'mp3-mp4', label: 'MP3 to MP4', path: '/tools/media/mp3-mp4', status: 'available' },
  { id: 'mp3-text', label: 'MP3 to Text', status: 'coming-soon' },
  { id: 'm4a-mp3', label: 'M4A to MP3', path: '/tools/convert/audio-convert', status: 'available' },
  { id: 'mkv-mp4', label: 'MKV to MP4', path: '/tools/convert/video-convert', status: 'available' },
  { id: 'mov-mp4', label: 'MOV to MP4', path: '/tools/convert/video-convert', status: 'available' },
  { id: 'wav-mp3', label: 'WAV to MP3', path: '/tools/convert/audio-convert', status: 'available' },
  { id: 'm4a-txt', label: 'M4A to TXT', status: 'coming-soon' },
];

function ConversionCard({ item }: { item: ConversionItem }) {
  const content = (
    <div
      className={`flex items-center justify-between gap-2 px-4 py-3 rounded-[var(--radius-sm)] border transition-colors ${
        item.status === 'available'
          ? 'border-[var(--border)] hover:border-[var(--accent)]/50 hover:bg-[var(--accent-muted)]/30 cursor-pointer'
          : 'border-[var(--border)]/60 bg-[var(--bg-tertiary)]/50 opacity-75 cursor-not-allowed'
      }`}
    >
      <span className="text-sm font-medium text-[var(--text-primary)]">{item.label}</span>
      {item.status === 'available' ? (
        <span className="text-xs text-[var(--accent)]">→</span>
      ) : (
        <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-secondary)] text-[var(--text-muted)]">Soon</span>
      )}
    </div>
  );

  if (item.status === 'available' && item.path) {
    return (
      <NavLink to={item.path} className="block">
        {content}
      </NavLink>
    );
  }
  return content;
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
        <p className="text-sm text-[var(--text-muted)]">
          Select a conversion below. Available tools run in your browser — no upload to external servers.
        </p>
        <ConversionSection title="Document Conversions" items={DOCUMENT_CONVERSIONS} />
        <ConversionSection title="Image Conversions" items={IMAGE_CONVERSIONS} />
        <ConversionSection title="Image Editing (Transparency)" items={IMAGE_EDITING} />
        <ConversionSection title="Audio / Video Conversions" items={AUDIO_VIDEO_CONVERSIONS} />
      </div>
    </ToolLayout>
  );
}
