import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { SiteFooter } from '../../components/SiteFooter';

interface Section {
  heading: string;
  body: ReactNode;
}

interface LegalPageLayoutProps {
  title: string;
  lastUpdated: string;
  intro: string;
  sections: Section[];
}

export function LegalPageLayout({ title, lastUpdated, intro, sections }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col">
      <main className="flex-1 px-4 py-8 sm:px-6 sm:py-10">
        <div className="mx-auto max-w-4xl rounded-3xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 sm:p-8 shadow-[var(--shadow-elevated)]">
          <div className="mb-6">
            <Link
              to="/"
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline-offset-4 hover:underline"
            >
              Back to workspace
            </Link>
            <h1 className="mt-3 text-2xl sm:text-3xl font-semibold text-[var(--text-primary)]">{title}</h1>
            <p className="mt-2 text-sm text-[var(--text-muted)]">Last updated: {lastUpdated}</p>
            <p className="mt-4 text-sm sm:text-base text-[var(--text-secondary)]">{intro}</p>
          </div>

          <div className="space-y-6">
            {sections.map((section) => (
              <section key={section.heading} className="rounded-2xl border border-[var(--border)] bg-[var(--bg-tertiary)]/45 p-4 sm:p-5">
                <h2 className="text-lg font-semibold text-[var(--text-primary)]">{section.heading}</h2>
                <div className="mt-2 text-sm leading-6 text-[var(--text-secondary)]">{section.body}</div>
              </section>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
