import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import { Provider } from 'react-intl-redux';
import Keycloak, { KeycloakInstance } from 'keycloak-js';

import App from './scenes/App';
import ErrorBoundary from 'components/ErrorBoundary';
import { configureStore } from './store';
import token from 'http/token';
import { isAdmin } from 'helpers/tokenParser';
import { API_BASE } from 'http/http';

import './styles/index.scss';
import { UserState } from './reducers/user';

const renderIndex = (userInfo: UserState) => {
  const root = document.getElementById('root');
  const { store, sentry } = configureStore(userInfo);

  ReactDOM.render(
    <ErrorBoundary sentry={sentry}>
      {/* Store is not typed yet
          // @ts-ignore */}
      <Provider store={store}>
        <App />
      </Provider>
    </ErrorBoundary>,
    root
  );
};

// Minimum number of seconds left of token before a refresh is needed
const minValiditySeconds = 60;

// How often should lib check for valid token
const refreshRateMs = 10000;

const initAuth = () => {
  const kc: KeycloakInstance = Keycloak(API_BASE + '/keycloak.json');
  const options = { checkLoginIframe: false };
  kc.init(options).success((authenticated: boolean) => {
    if (authenticated) {
      token.save(kc.token);
      setInterval(() => {
        kc.updateToken(minValiditySeconds).error(() => kc.logout());
        token.save(kc.token);
      }, refreshRateMs);
      const userInfo = {
        logoutUrl: kc.createLogoutUrl(options),
        // @ts-ignore
        familyName: kc.idTokenParsed?.family_name,
        // @ts-ignore
        givenName: kc.idTokenParsed.given_name,
        // @ts-ignore
        email: kc.idTokenParsed.email,
        // @ts-ignore
        username: kc.idTokenParsed.preferred_username,
        // @ts-ignore
        isAdmin: isAdmin(kc.tokenParsed)
      };
      renderIndex(userInfo);
    } else {
      kc.login();
    }
  });
};

initAuth();
