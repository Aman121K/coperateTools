import { LegalPageLayout } from './LegalPageLayout';

export function AcceptableUsePage() {
  return (
    <LegalPageLayout
      title="Acceptable Use Policy"
      lastUpdated="March 25, 2026"
      intro="This policy defines prohibited activities to keep the platform safe, lawful, and available to everyone."
      sections={[
        {
          heading: 'Prohibited Activities',
          body: (
            <p>
              You must not use DevTool for unlawful conduct, malware distribution, unauthorized access, harassment, fraud, or
              deceptive activities.
            </p>
          ),
        },
        {
          heading: 'Content Restrictions',
          body: (
            <p>
              Do not upload content that violates intellectual property rights, confidentiality obligations, privacy laws, or
              applicable export and sanctions rules.
            </p>
          ),
        },
        {
          heading: 'Platform Protection',
          body: (
            <p>
              Automated abuse, excessive traffic, reverse engineering of protected systems, or attempts to degrade service
              reliability are not allowed.
            </p>
          ),
        },
        {
          heading: 'Enforcement',
          body: (
            <p>
              We may suspend access or remove content that violates this policy and cooperate with lawful requests from competent
              authorities where required.
            </p>
          ),
        },
      ]}
    />
  );
}
