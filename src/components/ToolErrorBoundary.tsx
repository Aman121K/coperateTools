import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ToolErrorBoundaryProps {
  children: ReactNode;
}

interface ToolErrorBoundaryState {
  hasError: boolean;
}

export class ToolErrorBoundary extends Component<ToolErrorBoundaryProps, ToolErrorBoundaryState> {
  state: ToolErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): ToolErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[tool-error-boundary]', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-full min-h-[360px] flex items-center justify-center p-6">
          <div className="max-w-md w-full rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-6 text-center shadow-[var(--shadow-card)]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)]">Recovery Mode</p>
            <h2 className="mt-2 text-xl font-semibold text-[var(--text-primary)]">This tool hit an unexpected error</h2>
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              Please refresh and try again. Your other tools and workspace are still available.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-semibold px-4 py-2.5 transition-colors"
            >
              Reload Workspace
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
