import { LegalPageLayout } from './LegalPageLayout';

export function AboutPage() {
  return (
    <LegalPageLayout
      title="About Us"
      lastUpdated="March 25, 2026"
      intro="DevTool is a global utility workspace built to simplify day-to-day digital tasks for teams and individual users."
      sections={[
        {
          heading: 'Our Mission',
          body: (
            <p>
              Deliver fast, reliable, and easy-to-use browser tools so users can complete conversions, formatting, and operations
              workflows without setup friction.
            </p>
          ),
        },
        {
          heading: 'What We Build',
          body: (
            <p>
              We focus on practical utilities across JSON/data handling, file conversion, document workflows, finance calculators,
              operations templates, and developer support tools.
            </p>
          ),
        },
        {
          heading: 'Global Product Focus',
          body: (
            <p>
              We design for accessibility, responsive usage on desktop and mobile, and clear workflows that can work across
              geographies, teams, and technical backgrounds.
            </p>
          ),
        },
      ]}
    />
  );
}
