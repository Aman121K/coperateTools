import { LegalPageLayout } from './LegalPageLayout';

export function PrivacyPage() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      lastUpdated="March 25, 2026"
      intro="This Privacy Policy explains what data we collect, why we collect it, and how we protect it."
      sections={[
        {
          heading: 'What We Collect',
          body: (
            <p>
              We may collect account details (such as name and email), usage events, technical diagnostics, and limited local
              preference data to improve reliability and security. This can include visitor IP address and derived location
              attributes (for example country, region, and city) for analytics and abuse prevention.
            </p>
          ),
        },
        {
          heading: 'How We Use Data',
          body: (
            <p>
              Data is used to authenticate users, provide requested features, improve product quality, prevent abuse, and support
              customer inquiries.
            </p>
          ),
        },
        {
          heading: 'Data Sharing',
          body: (
            <p>
              We do not sell personal data. We may share data with service providers that support hosting, authentication,
              analytics, and security operations under contractual safeguards.
            </p>
          ),
        },
        {
          heading: 'International Use',
          body: (
            <p>
              Since DevTool is offered globally, data may be processed across multiple jurisdictions with suitable safeguards where
              required by law.
            </p>
          ),
        },
        {
          heading: 'Your Rights',
          body: (
            <p>
              Depending on your location, you may have rights to access, correct, delete, or export your personal data and to
              object to certain processing activities.
            </p>
          ),
        },
        {
          heading: 'Security and Retention',
          body: (
            <p>
              We apply technical and organizational controls to protect information and keep data only as long as needed for
              operational, legal, and security purposes.
            </p>
          ),
        },
      ]}
    />
  );
}
