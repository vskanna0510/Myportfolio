import React, { Component, type ErrorInfo, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean; error?: Error };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("App error:", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-root" style={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "12px", padding: "24px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: "18px" }}>Something went wrong</h1>
          <p className="muted">Refresh the page to try again.</p>
          <button
            type="button"
            className="primary-button"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
