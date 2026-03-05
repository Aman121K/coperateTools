import { useMemo, useState, type FormEvent } from 'react';
import { db } from '../../config/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { DEPARTMENTS, TOOLS } from '../../data/tools';
import { logUserActivity } from '../../services/activityLogger';
import { submitToolSuggestion, type SuggestionType } from '../../services/toolSuggestionService';

export function ToolSuggestions() {
  const { user, profile, authProvider } = useAuth();
  const [type, setType] = useState<SuggestionType>('existing_tool_feedback');
  const [existingToolId, setExistingToolId] = useState('');
  const [existingToolRating, setExistingToolRating] = useState('3');
  const [requestedToolName, setRequestedToolName] = useState('');
  const [requestedToolDepartment, setRequestedToolDepartment] = useState('general');
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [contactEmail, setContactEmail] = useState(user?.email ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const toolOptions = useMemo(
    () => [...TOOLS].sort((a, b) => a.name.localeCompare(b.name)),
    []
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const safeTitle = title.trim();
    const safeDetails = details.trim();
    if (!safeTitle || !safeDetails) {
      setError('Please add a short title and detailed feedback.');
      return;
    }

    if (type === 'existing_tool_feedback' && !existingToolId) {
      setError('Please select the tool you are giving feedback for.');
      return;
    }

    if (type === 'new_tool_request' && !requestedToolName.trim()) {
      setError('Please enter the new tool name you want.');
      return;
    }

    setSubmitting(true);
    try {
      const result = await submitToolSuggestion(db, {
        type,
        title: safeTitle,
        details: safeDetails,
        existingToolId: type === 'existing_tool_feedback' ? existingToolId : null,
        existingToolRating: type === 'existing_tool_feedback' ? Number(existingToolRating) : null,
        requestedToolName: type === 'new_tool_request' ? requestedToolName : null,
        requestedToolDepartment:
          type === 'new_tool_request' ? (requestedToolDepartment as keyof typeof DEPARTMENTS) : null,
        contactEmail: contactEmail.trim() || null,
        roleId: profile?.roleId ?? null,
        profileDepartment: profile?.department ?? null,
        userId: user?.uid ?? null,
        userName: user?.displayName ?? user?.email ?? null,
      });

      if (user && authProvider === 'firebase') {
        void logUserActivity(db, user.uid, {
          action: 'tool_suggestion_submitted',
          toolId: 'tool-suggestions',
          suggestionType: type,
          suggestionTitle: safeTitle,
          existingToolId: type === 'existing_tool_feedback' ? existingToolId : null,
          requestedToolName: type === 'new_tool_request' ? requestedToolName : null,
          storedIn: result.storage,
        }).catch((e) => console.error('[firebase][logUserActivity:tool_suggestion_submitted]', e));
      }

      setTitle('');
      setDetails('');
      setExistingToolId('');
      setExistingToolRating('3');
      setRequestedToolName('');
      setRequestedToolDepartment('general');
      setSuccess(
        result.storage === 'cloud'
          ? 'Thanks, your suggestion was submitted successfully.'
          : 'Thanks, your suggestion was saved locally. Configure Firebase to sync centrally.'
      );
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Unable to submit suggestion.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="px-4 sm:px-6 py-5 border-b border-[var(--border)] bg-[var(--bg-secondary)]/95">
        <p className="text-[11px] uppercase tracking-[0.16em] text-[var(--text-muted)] mb-1">Feedback</p>
        <h1 className="text-xl sm:text-2xl font-semibold text-[var(--text-primary)]">Tool Suggestions</h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Share feedback on existing tools or request a new tool you want in this dashboard.
        </p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl space-y-5 rounded-2xl border border-[var(--border)] bg-[var(--bg-secondary)] p-4 sm:p-6"
        >
          <div>
            <label htmlFor="suggestion-type" className="block text-sm text-[var(--text-secondary)] mb-2">
              Suggestion Type
            </label>
            <select
              id="suggestion-type"
              value={type}
              onChange={(e) => setType(e.target.value as SuggestionType)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/55"
            >
              <option value="existing_tool_feedback">Feedback on Existing Tool</option>
              <option value="new_tool_request">Request New Tool</option>
            </select>
          </div>

          {type === 'existing_tool_feedback' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="existing-tool" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Existing Tool
                </label>
                <select
                  id="existing-tool"
                  value={existingToolId}
                  onChange={(e) => setExistingToolId(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/55"
                >
                  <option value="">Select a tool</option>
                  {toolOptions.map((tool) => (
                    <option key={tool.id} value={tool.id}>
                      {tool.name} ({DEPARTMENTS[tool.department]})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="existing-rating" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Rating
                </label>
                <select
                  id="existing-rating"
                  value={existingToolRating}
                  onChange={(e) => setExistingToolRating(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/55"
                >
                  <option value="5">5 - Excellent</option>
                  <option value="4">4 - Good</option>
                  <option value="3">3 - Okay</option>
                  <option value="2">2 - Needs Work</option>
                  <option value="1">1 - Poor</option>
                </select>
              </div>
            </div>
          )}

          {type === 'new_tool_request' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="new-tool-name" className="block text-sm text-[var(--text-secondary)] mb-2">
                  New Tool Name
                </label>
                <input
                  id="new-tool-name"
                  value={requestedToolName}
                  onChange={(e) => setRequestedToolName(e.target.value)}
                  placeholder="Example: PDF Password Remover"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/55"
                />
              </div>
              <div>
                <label htmlFor="new-tool-dept" className="block text-sm text-[var(--text-secondary)] mb-2">
                  Suggested Department
                </label>
                <select
                  id="new-tool-dept"
                  value={requestedToolDepartment}
                  onChange={(e) => setRequestedToolDepartment(e.target.value)}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent)]/55"
                >
                  {Object.entries(DEPARTMENTS).map(([departmentKey, departmentLabel]) => (
                    <option key={departmentKey} value={departmentKey}>
                      {departmentLabel}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div>
            <label htmlFor="suggestion-title" className="block text-sm text-[var(--text-secondary)] mb-2">
              Title
            </label>
            <input
              id="suggestion-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'new_tool_request' ? 'What tool do you need?' : 'What should be improved?'}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/55"
            />
          </div>

          <div>
            <label htmlFor="suggestion-details" className="block text-sm text-[var(--text-secondary)] mb-2">
              Details
            </label>
            <textarea
              id="suggestion-details"
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={6}
              placeholder="Tell us your use-case, expected behavior, and pain points."
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/55"
            />
          </div>

          <div>
            <label htmlFor="contact-email" className="block text-sm text-[var(--text-secondary)] mb-2">
              Contact Email (optional)
            </label>
            <input
              id="contact-email"
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg-tertiary)] px-3 py-2.5 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]/55"
            />
          </div>

          {error && <p className="text-sm text-[var(--error)]">⚠ {error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="rounded-xl bg-[var(--accent)] hover:bg-[var(--accent-hover)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2.5 transition-colors"
            >
              {submitting ? 'Submitting...' : 'Submit Suggestion'}
            </button>
            <span className="text-xs text-[var(--text-muted)]">
              {authProvider === 'firebase'
                ? 'Saved to cloud.'
                : 'Saved locally in this browser until Firebase is configured.'}
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
