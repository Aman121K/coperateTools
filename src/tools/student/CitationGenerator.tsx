import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';

type Style = 'apa' | 'mla' | 'harvard';

function formatApa(author: string, year: string, title: string, source: string, url: string): string {
  return `${author} (${year}). ${title}. ${source}${url ? `. ${url}` : ''}`;
}

function formatMla(author: string, title: string, source: string, year: string, url: string): string {
  return `${author}. "${title}." ${source}, ${year}.${url ? ` ${url}` : ''}`;
}

function formatHarvard(author: string, year: string, title: string, source: string, url: string): string {
  return `${author} ${year}, ${title}, ${source}${url ? `, viewed ${new Date().toLocaleDateString()}, ${url}` : ''}`;
}

export function CitationGenerator() {
  const [style, setStyle] = useState<Style>('apa');
  const [author, setAuthor] = useState('Smith, J.');
  const [year, setYear] = useState('2024');
  const [title, setTitle] = useState('The Art of Learning');
  const [source, setSource] = useState('Academic Press');
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState('');

  useEffect(() => {
    let formatted = '';
    if (style === 'apa') formatted = formatApa(author, year, title, source, url);
    else if (style === 'mla') formatted = formatMla(author, title, source, year, url);
    else formatted = formatHarvard(author, year, title, source, url);
    setOutput(formatted);
  }, [style, author, year, title, source, url]);

  return (
    <ToolLayout title="Citation Generator" description="Generate citations in APA, MLA, Harvard. Purpose: Format references correctly for essays and research papers." input="" output={output} onInputChange={() => {}} toolId="citation-generator" singlePanel showCopyMinified={false}>
      <div className="max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Citation Style</label>
          <select value={style} onChange={(e) => setStyle(e.target.value as Style)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]">
            <option value="apa">APA 7th</option>
            <option value="mla">MLA 9th</option>
            <option value="harvard">Harvard</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Author</label>
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Smith, J. or Smith, John" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Year</label>
          <input value={year} onChange={(e) => setYear(e.target.value)} placeholder="2024" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article or book title" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Source (Journal, Publisher, etc.)</label>
          <input value={source} onChange={(e) => setSource(e.target.value)} placeholder="Journal of X, Vol. 1" className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">URL (optional)</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div className="p-4 rounded-[var(--radius)] bg-[var(--accent-muted)] border border-[var(--accent)]/30">
          <p className="text-xs text-[var(--text-muted)] mb-1">{style.toUpperCase()} Citation</p>
          <p className="font-medium">{output}</p>
        </div>
      </div>
    </ToolLayout>
  );
}
