import { LegalPageLayout } from './LegalPageLayout';

const supportEmail = import.meta.env.VITE_SUPPORT_EMAIL || 'support@devtool.app';

export function ContactPage() {
  return (
    <LegalPageLayout
      title="Contact Us"
      lastUpdated="March 25, 2026"
      intro="Reach out for support issues, policy requests, privacy questions, or enterprise onboarding."
      sections={[
        {
          heading: 'Support',
          body: (
            <p>
              For account, workflow, or technical support, email{' '}
              <a className="underline" href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
              . Include steps to reproduce and screenshots where possible for faster resolution.
            </p>
          ),
        },
        {
          heading: 'Privacy and Data Requests',
          body: (
            <p>
              For data access, correction, deletion, or portability requests, contact the same support address with the subject
              line "Privacy Request".
            </p>
          ),
        },
        {
          heading: 'Business Inquiries',
          body: (
            <p>
              For partnerships, custom tooling, or enterprise deployment discussions, contact us with the subject line "Business
              Inquiry" and your region/timezone.
            </p>
          ),
        },
      ]}
    />
  );
}
