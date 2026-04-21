import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("MFE failed to load:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "2rem",
            textAlign: "center",
            fontSize: "14px",
            color: "var(--hint)",
            border: "1px dashed var(--border)",
            borderRadius: "8px",
            background: "rgba(255,100,100,0.05)",
          }}
        >
          ⚠ {this.props.fallbackMessage || "Widget unavailable"}
        </div>
      );
    }

    return this.props.children;
  }
}
