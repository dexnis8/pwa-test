import { Component } from "react";

/**
 * The last line of defence.
 *
 * Until now a thrown render — a malformed question payload, a null where the
 * code expected an object — took the whole app to a blank white page with no
 * way back except closing the tab. On a PWA that reads as "the app is broken",
 * and mid-duel it reads as "I just lost my match".
 *
 * This catches it, keeps the shell alive, and offers the two things that
 * actually recover: reload, or go home. It deliberately does not show the
 * learner a stack trace; that goes to the console for us.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  handleReset = () => {
    this.setState({ error: null });
  };

  render() {
    const { error } = this.state;
    const { children, fallback } = this.props;

    if (!error) return children;
    if (fallback) return fallback(error, this.handleReset);

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-2xl">
          😕
        </div>
        <p className="mb-1 text-lg font-bold text-gray-900">
          Something went wrong
        </p>
        <p className="mb-6 max-w-xs text-sm text-gray-500">
          This screen ran into a problem. Nothing you have done is lost — your
          progress is saved on the server.
        </p>
        <div className="flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="rounded-full bg-[#16956C] px-8 py-3 text-sm font-bold text-white"
          >
            Reload
          </button>
          <button
            type="button"
            onClick={() => {
              this.handleReset();
              window.location.assign("/dashboard");
            }}
            className="px-4 py-2 text-sm font-semibold text-gray-500"
          >
            Go to dashboard
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
