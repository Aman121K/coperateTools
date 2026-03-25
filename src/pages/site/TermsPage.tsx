import { LegalPageLayout } from './LegalPageLayout';

export function TermsPage() {
  return (
    <LegalPageLayout
      title="Terms & Conditions"
      lastUpdated="March 25, 2026"
      intro="These terms govern your use of DevTool and all related services, features, and content."
      sections={[
        {
          heading: 'Acceptance of Terms',
          body: (
            <p>
              By accessing or using DevTool, you agree to comply with these terms, all applicable laws, and our policies.
              If you do not agree, do not use the platform.
            </p>
          ),
        },
        {
          heading: 'Permitted Use',
          body: (
            <p>
              You may use the platform for lawful personal or business workflows. You are responsible for how you use tool outputs
              and for ensuring your own compliance requirements in your region.
            </p>
          ),
        },
        {
          heading: 'User Content and Data',
          body: (
            <p>
              You retain ownership of content you input. You must not upload unlawful, infringing, malicious, or sensitive data
              unless you have legal rights and proper authorization.
            </p>
          ),
        },
        {
          heading: 'Service Availability',
          body: (
            <p>
              We aim for reliable access globally, but availability can vary due to maintenance, third-party outages, regional
              restrictions, or technical issues.
            </p>
          ),
        },
        {
          heading: 'Limitation of Liability',
          body: (
            <p>
              To the maximum extent allowed by law, DevTool is provided "as is" without warranties, and we are not liable for
              indirect or consequential losses arising from use of the service.
            </p>
          ),
        },
        {
          heading: 'Policy Updates',
          body: (
            <p>
              We may update these terms as the product evolves. Continued use after publication of updated terms means you accept
              the revised version.
            </p>
          ),
        },
      ]}
    />
  );
}
