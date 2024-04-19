import { Apollo } from 'api';
import { ConfigContext, useConfig } from 'config/ConfigContext';
import { fetchConfig } from 'config/fetchConfig';
import ReactDOM from 'react-dom/client';
import App from 'scenes/App';

import * as Sentry from '@sentry/react';
import { AuthProvider, useAuth } from 'app/auth';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { store } from 'app/store';
import { selectAuthLoaded, updateAuth } from 'features/app/authSlice';
import { selectConfigLoaded, updateConfig } from 'features/app/configSlice';
import { normalizeAllUrls } from 'helpers/url';
import { EnkiIntlProvider } from 'i18n/EnkiIntlProvider';
import { Provider } from 'react-redux';
import './styles/index.scss';
import { browserTracingIntegration } from '@sentry/react';

const initSentry = (dsn?: string) => {
  if (dsn) {
    Sentry.init({
      dsn: dsn,
      integrations: [browserTracingIntegration()],

      // We recommend adjusting this value in production, or using tracesSampler
      // for finer control
      tracesSampleRate: 1.0,

      release: import.meta.env.REACT_APP_VERSION,
      attachStacktrace: true,
      beforeSend(e) {
        return normalizeAllUrls(e);
      },
    });
  }
};

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

  initSentry(config.sentryDSN);

  root.render(
    <Sentry.ErrorBoundary>
      <ConfigContext.Provider value={config}>
        <Provider store={store}>
          <EnkiIntlProvider>
            <AuthProvider>
              <AuthenticatedApp />
            </AuthProvider>
          </EnkiIntlProvider>
        </Provider>
      </ConfigContext.Provider>
    </Sentry.ErrorBoundary>,
  );
};

renderIndex();
