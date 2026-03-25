import { Link } from 'react-router-dom';

const legalLinks = [
  { to: '/terms-and-conditions', label: 'Terms & Conditions' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/cookie-policy', label: 'Cookie Policy' },
  { to: '/acceptable-use-policy', label: 'Acceptable Use' },
  { to: '/disclaimer', label: 'Disclaimer' },
];

const companyLinks = [
  { to: '/about-us', label: 'About Us' },
  { to: '/contact-us', label: 'Contact Us' },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="shrink-0 border-t border-[var(--border)] bg-[var(--bg-secondary)]/90 backdrop-blur px-4 py-5 sm:px-6">
      <div className="mx-auto w-full max-w-7xl">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)]">DevTool Global</p>
            <p className="mt-2 text-sm text-[var(--text-secondary)] max-w-xl">
              Reliable web tools for developers, operations teams, and everyday users across regions.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2">Policies</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {legalLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--text-muted)] mb-2">Company</p>
              <div className="flex flex-wrap gap-x-4 gap-y-2">
                {companyLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] underline-offset-4 hover:underline"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 pt-4 border-t border-[var(--border)] text-xs text-[var(--text-muted)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p>{year} DevTool. All rights reserved.</p>
          <p>By using this website, you agree to our Terms and Privacy Policy.</p>
        </div>
      </div>
    </footer>
  );
}
