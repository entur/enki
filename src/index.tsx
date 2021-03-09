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

const renderIndex = () => {
  const root = document.getElementById('root');

  ReactDOM.render(
    <AuthProvider keycloakConfigUrl={API_BASE + '/keycloak.json'}>
      <AuthenticatedApp />
    </AuthProvider>,
    root
  );
};

renderIndex();
