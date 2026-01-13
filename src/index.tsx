import { Apollo } from 'api';
import { ConfigContext, useConfig } from 'config/ConfigContext';
import { fetchConfig } from 'config/fetchConfig';
import ReactDOM from 'react-dom/client';
import App from 'scenes/App';

import { AuthProvider, useAuth } from 'auth/auth';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { store } from 'store/store';
import { selectAuthLoaded, updateAuth } from 'auth/authSlice';
import { selectConfigLoaded, updateConfig } from 'config/configSlice';
import { EnkiIntlProvider } from 'i18n/EnkiIntlProvider';
import { Provider } from 'react-redux';
import './styles/index.scss';
import { LandingPage } from './scenes/App/LandingPage';
import {
  ComponentToggle,
  ComponentToggleProvider,
  ToggleFlags,
} from '@entur/react-component-toggle';

const AuthenticatedApp = () => {
  const dispatch = useAppDispatch();
  const authStateLoaded = useAppSelector(selectAuthLoaded);
  const configStateLoaded = useAppSelector(selectConfigLoaded);
  const auth = useAuth();
  const config = useConfig();

  dispatch(updateConfig(config));
  dispatch(updateAuth(auth));

  return (
    (authStateLoaded && configStateLoaded && auth.isAuthenticated && (
      <Apollo>
        <App />
      </Apollo>
    )) ||
    (authStateLoaded && configStateLoaded && (
      <ComponentToggle
        feature={`${config.extPath}/LandingPage`}
        renderFallback={() => <LandingPage />}
      />
    ))
  );
};

const EnkiApp = () => {
  return (
    <EnkiIntlProvider>
      <AuthProvider>
        <AuthenticatedApp />
      </AuthProvider>
    </EnkiIntlProvider>
  );
};

const renderIndex = async () => {
  const container = document.getElementById('root');
  const root = ReactDOM.createRoot(container!);
  const config = await fetchConfig();

  root.render(
    <ConfigContext.Provider value={config}>
      <ComponentToggleProvider
        flags={(config.sandboxFeatures || {}) as ToggleFlags}
        maxFeatureDepth={2}
        importFn={(featurePathComponents) => {
          if (featurePathComponents.length === 1) {
            return import(`./ext/${featurePathComponents[0]}/index.ts`);
          } else if (featurePathComponents.length === 2) {
            return import(
              `./ext/${featurePathComponents[0]}/${featurePathComponents[1]}/index.ts`
            );
          } else {
            throw new Error('Max feature depth is 2');
          }
        }}
      >
        <Provider store={store}>
          <ComponentToggle feature={`${config.extPath}/CustomStyle`} />
          <ComponentToggle
            feature={`${config.extPath}/CustomIntlProvider`}
            renderFallback={() => <EnkiApp />}
          >
            <AuthProvider>
              <AuthenticatedApp />
            </AuthProvider>
          </ComponentToggle>
        </Provider>
      </ComponentToggleProvider>
    </ConfigContext.Provider>,
  );
};

renderIndex();
