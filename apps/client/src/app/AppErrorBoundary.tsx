import type { ErrorInfo, ReactNode } from "react";
import { Component } from "react";
import { logger } from "../lib/logger";

interface AppErrorBoundaryProps {
  children: ReactNode;
}

interface AppErrorBoundaryState {
  error: Error | null;
}

export class AppErrorBoundary extends Component<AppErrorBoundaryProps, AppErrorBoundaryState> {
  state: AppErrorBoundaryState = {
    error: null,
  };

  static getDerivedStateFromError(error: Error): AppErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logger.error("Application render failed", { error, info });
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.assign("/");
  };

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-canvas-parchment px-lg py-section text-ink">
        <div className="mx-auto max-w-xl rounded-lg bg-canvas p-xl shadow-sm">
          <p className="text-caption-strong text-primary">Application Error</p>
          <h1 className="mt-sm text-display-md">Something broke before this page could render.</h1>
          <p className="mt-md text-body text-ink-muted-80">
            Reload the app or return home. The error has been recorded for debugging.
          </p>
          {import.meta.env.DEV && (
            <pre className="mt-lg overflow-x-auto rounded-md bg-surface-pearl p-md text-caption text-ink">
              {this.state.error.message}
            </pre>
          )}
          <div className="mt-xl flex flex-wrap gap-md">
            <button
              className="rounded-md bg-primary px-lg py-sm text-body-on-dark"
              onClick={this.handleReload}
              type="button"
            >
              Reload
            </button>
            <button
              className="rounded-md border border-hairline px-lg py-sm text-ink"
              onClick={this.handleGoHome}
              type="button"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
