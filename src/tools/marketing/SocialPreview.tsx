import { useState } from 'react';
import { ToolLayout } from '../../components/ToolLayout';
import { Editor } from '../../components/Editor';

export function SocialPreview() {
  const [title, setTitle] = useState('Your Page Title');
  const [description, setDescription] = useState('A brief description of your page for social sharing.');
  const [url, setUrl] = useState('example.com');
  const [image, setImage] = useState('');

  return (
    <ToolLayout title="Social Media Preview" description="Preview how links appear when shared. Purpose: See how your URL shows on Twitter, LinkedIn, or Slack before sharing." input="" output="" onInputChange={() => {}} toolId="social-preview" singlePanel showCopyMinified={false}>
      <div className="max-w-2xl space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Description</label>
              <Editor value={description} onChange={setDescription} language="plaintext" height="80px" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">URL</label>
              <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1">Image URL (optional)</label>
              <input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." className="w-full px-4 py-2 rounded-[var(--radius-sm)] bg-[var(--bg-tertiary)] border border-[var(--border)]" />
            </div>
          </div>
          <div className="rounded-[var(--radius)] border border-[var(--border)] overflow-hidden bg-white">
            <div className="aspect-video bg-[var(--bg-tertiary)] flex items-center justify-center">
              {image ? <img src={image} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} /> : <span className="text-[var(--text-muted)]">No image</span>}
            </div>
            <div className="p-3 text-black">
              <p className="font-semibold text-sm truncate">{title}</p>
              <p className="text-xs text-gray-600 line-clamp-2">{description}</p>
              <p className="text-xs text-gray-400 mt-1">{url}</p>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
