import ReactDOM from 'react-dom/client';
import App from 'scenes/App';
import { store } from './app/store';
import { Apollo } from 'api';
import AuthProvider, { useAuth } from '@entur/auth-provider';
import { fetchConfig } from 'config/fetchConfig';
import { ConfigContext, useConfig } from 'config/ConfigContext';
import { Provider } from 'react-intl-redux';

import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectConfigLoaded, updateConfig } from 'features/app/configSlice';
import { selectAuthLoaded, updateAuth } from 'features/app/authSlice';
import * as Sentry from '@sentry/react';
import './styles/index.scss';
import { getEnvironment } from 'config/getEnvironment';
import { normalizeAllUrls } from 'helpers/url';

if (process.env.REACT_APP_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Sentry.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,

    environment: getEnvironment(),
    release: process.env.REACT_APP_VERSION,
    attachStacktrace: true,
    beforeSend(e) {
      return normalizeAllUrls(e);
    },
  });
}

const AuthenticatedApp = () => {
  const dispatch = useAppDispatch();
  const authStateLoaded = useAppSelector(selectAuthLoaded);
  const configStateLoaded = useAppSelector(selectConfigLoaded);
  const auth = useAuth();
  const config = useConfig();

  dispatch(updateConfig(config));
  dispatch(updateAuth(auth));

  return (
    (authStateLoaded && configStateLoaded && (
      <Apollo>
        <App />
      </Apollo>
    )) ||
    null
  );
};

const renderIndex = async () => {
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container!);

  const config = await fetchConfig();

  const { claimsNamespace, auth0: auth0Config } = config;
  root.render(
    <Sentry.ErrorBoundary>
      <Provider store={store}>
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
        </AuthProvider>
      </Provider>
    </Sentry.ErrorBoundary>
  );
};

renderIndex();
