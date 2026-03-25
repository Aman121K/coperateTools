import { LegalPageLayout } from './LegalPageLayout';

export function DisclaimerPage() {
  return (
    <LegalPageLayout
      title="Disclaimer"
      lastUpdated="March 25, 2026"
      intro="Tool outputs are for informational and productivity support purposes and are not legal, financial, tax, or medical advice."
      sections={[
        {
          heading: 'No Professional Advice',
          body: (
            <p>
              Outputs from calculators, templates, and generators should be reviewed by qualified professionals before relying on
              them for regulated or high-stakes decisions.
            </p>
          ),
        },
        {
          heading: 'Accuracy Limitations',
          body: (
            <p>
              We work to improve correctness, but we do not guarantee error-free results. Input quality, locale assumptions, and
              third-party dependencies may affect output.
            </p>
          ),
        },
        {
          heading: 'Third-Party Services',
          body: (
            <p>
              Some features rely on external libraries or services. Their availability and behavior may change independently.
            </p>
          ),
        },
      ]}
    />
  );
}
