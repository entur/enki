import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-intl-redux';

import App from 'scenes/App';
import ErrorBoundary from 'components/ErrorBoundary';
import { configureStore } from './store';
import { API_BASE } from 'http/http';

import './styles/index.scss';
import { Apollo } from 'api';
import AuthProvider, { useAuth } from '@entur/auth-provider';

const AuthenticatedApp = () => {
  const auth = useAuth();
  const { store, sentry } = configureStore(auth);

  return (
    <ErrorBoundary sentry={sentry}>
      {/* Store is not typed yet
          // @ts-ignore */}

      <Provider store={store}>
        <Apollo>
          <App />
        </Apollo>
      </Provider>
    </ErrorBoundary>
  );
};

const renderIndex = async () => {
  const root = document.getElementById('root');
  const response: any = await fetch(API_BASE + '/auth0.json');

  const { claimsNamespace: auth0ClaimsNamespace, ...auth0Config } =
    await response.json();

  ReactDOM.render(
    <AuthProvider
      auth0Config={{
        ...auth0Config,
        redirectUri: window.location.origin,
      }}
      auth0ClaimsNamespace={auth0ClaimsNamespace}
    >
      <AuthenticatedApp />
    </AuthProvider>,
    root
  );
};

renderIndex();
