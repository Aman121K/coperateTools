import { LegalPageLayout } from './LegalPageLayout';

export function CookiePolicyPage() {
  return (
    <LegalPageLayout
      title="Cookie Policy"
      lastUpdated="March 25, 2026"
      intro="This page explains how cookies and similar technologies are used on DevTool."
      sections={[
        {
          heading: 'Essential Cookies',
          body: (
            <p>
              These are required for core functionality such as authentication, session continuity, and security controls.
            </p>
          ),
        },
        {
          heading: 'Preference Cookies',
          body: (
            <p>
              We may store non-sensitive preferences such as UI theme or productivity settings to provide a smoother experience.
            </p>
          ),
        },
        {
          heading: 'Analytics and Performance',
          body: (
            <p>
              Limited measurement data may be used to understand feature usage and improve performance, uptime, and usability.
            </p>
          ),
        },
        {
          heading: 'Managing Cookies',
          body: (
            <p>
              You can manage cookies through browser settings. Disabling some cookies may impact functionality, login, and saved
              preferences.
            </p>
          ),
        },
      ]}
    />
  );
}
