import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-intl-redux';

import App from 'scenes/App';
import ErrorBoundary from 'components/ErrorBoundary';
import { configureStore } from './store';

import './styles/index.scss';
import { Apollo } from 'api';
import AuthProvider, { useAuth } from '@entur/auth-provider';
import { fetchConfig } from 'config/fetchConfig';
import { ConfigContext, useConfig } from 'config/ConfigContext';

const AuthenticatedApp = () => {
  const auth = useAuth();
  const config = useConfig();
  const { store, sentry } = configureStore(auth, config);

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
  const config = await fetchConfig();

  const { claimsNamespace, auth0: auth0Config } = config;

  ReactDOM.render(
    <AuthProvider
      auth0Config={{
        ...auth0Config,
        redirectUri: window.location.origin,
      }}
      auth0ClaimsNamespace={claimsNamespace}
    >
      <ConfigContext.Provider value={config}>
        <AuthenticatedApp />
      </ConfigContext.Provider>
    </AuthProvider>,
    root
  );
};

renderIndex();
