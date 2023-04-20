import ReactDOM from 'react-dom/client';
import App from 'scenes/App';
import ErrorBoundary from 'components/ErrorBoundary';
import { store } from './app/store';
import { Apollo } from 'api';
import AuthProvider, { useAuth } from '@entur/auth-provider';
import { fetchConfig } from 'config/fetchConfig';
import { ConfigContext, useConfig } from 'config/ConfigContext';
import { Provider } from 'react-redux';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import { selectConfigLoaded, updateConfig } from 'features/app/configSlice';
import { selectAuthLoaded, updateAuth } from 'features/app/authSlice';
import './styles/index.scss';

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
  );
};

renderIndex();
