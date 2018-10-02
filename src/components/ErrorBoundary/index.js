import React, { Component } from 'react';

class ErrorBoundary extends Component {
  state = { error: null };

  componentDidCatch(error, errorInfo) {
    const { Raven } = this.props;
    this.setState({ error });
    Raven.captureException(error, { extra: errorInfo });
  }

  render() {
    const { Raven, children } = this.props;
    const showError = this.state.error;

    return showError ? (
      <div onClick={() => Raven.lastEventId() && Raven.showReportDialog()}>
        <h1>Unexpected error</h1>
        Please notify the system administrator if the problem persists.
      </div>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
