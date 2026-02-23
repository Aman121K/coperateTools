import { useState, useEffect } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function MetaTagsGenerator() {
  const [title, setTitle] = useState('Page Title');
  const [description, setDescription] = useState('Page description for SEO');
  const [url, setUrl] = useState('https://example.com/page');
  const [image, setImage] = useState('https://example.com/og-image.jpg');
  const [output, setOutput] = useState('');

  useEffect(() => {
    const tags = `<!-- Primary Meta Tags -->
<title>${title}</title>
<meta name="title" content="${title}">
<meta name="description" content="${description}">

<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="${url}">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${image}">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="${url}">
<meta property="twitter:title" content="${title}">
<meta property="twitter:description" content="${description}">
<meta property="twitter:image" content="${image}">`;
    setOutput(tags);
  }, [title, description, url, image]);

  return (
    <ToolLayout title="Meta Tags Generator" description="Generate SEO meta tags for web pages. Purpose: Improve search visibility and social sharing previews for your site." input="" output={output} onInputChange={() => {}} toolId="meta-tags" singlePanel showCopyMinified={false}>
      <div className="max-w-2xl space-y-4">
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
          <Editor value={description} onChange={setDescription} language="plaintext" height="60px" />
          <p className="text-xs text-[var(--text-muted)] mt-1">{description.length}/160 chars (optimal for SEO)</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">URL</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">OG Image URL</label>
          <input value={image} onChange={(e) => setImage(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
        </div>
        <div>
          <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Generated HTML</label>
          <pre className="p-4 rounded-[var(--radius)] bg-[var(--bg-tertiary)] border border-[var(--border)] text-sm overflow-auto max-h-64">{output}</pre>
        </div>
      </div>
    </ToolLayout>
  );
}
