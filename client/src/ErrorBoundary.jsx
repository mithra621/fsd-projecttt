import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#ffebee', color: '#c62828', fontFamily: 'monospace', height: '100vh' }}>
          <h2>React Runtime Crash!</h2>
          <p><strong>Error:</strong> {this.state.error && this.state.error.toString()}</p>
          <pre style={{ overflowX: 'auto', marginTop: '10px', background: '#fff', padding: '10px', border: '1px solid #ffcdd2' }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </pre>
          <p style={{ marginTop: '20px' }}>Please copy this red error text and paste it to the AI Assistant so it can debug exactly what crashed!</p>
        </div>
      );
    }
    return this.props.children;
  }
}
