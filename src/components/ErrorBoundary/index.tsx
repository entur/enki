import React, { Component } from 'react';
import * as Sentry from '@sentry/browser';

type ErrorProps = {
  sentry: typeof Sentry;
};

class ErrorBoundary extends Component<ErrorProps> {
  state = { error: null };

  componentDidCatch(error: Error, info: object) {
    const { sentry } = this.props;
    this.setState({ error });
    sentry.withScope((scope) => {
      scope.setExtra('extra', info);
      sentry.captureException(error);
    });
  }

  render() {
    const { sentry, children } = this.props;
    const showError = this.state.error;

    return showError ? (
      <div onClick={() => sentry.lastEventId() && sentry.showReportDialog()}>
        <h1>Unexpected error</h1>
        Please notify the system administrator if the problem persists.
      </div>
    ) : (
      children
    );
  }
}

export default ErrorBoundary;
