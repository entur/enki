import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import { Provider } from 'react-intl-redux';
import Keycloak from 'keycloak-js';

import App from './scenes/App';
import ErrorBoundary from './components/ErrorBoundary';
import { configureStore } from './store';
import token, { TOKEN_ID } from './http/token';
import { isAdmin } from './helpers/tokenParser';
import { API_BASE } from './http/http';

import './styles/index.css';

const renderIndex = userInfo => {
  const root = document.getElementById('root');
  const { store, Raven } = configureStore(userInfo, {
    active: localStorage.getItem(TOKEN_ID + '::activeId')
  });

  ReactDOM.render(
    <ErrorBoundary Raven={Raven}>
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
  const kc = new Keycloak(API_BASE + '/keycloak.json');
  const options = { checkLoginIframe: false };
  kc.init(options).success(authenticated => {
    if (authenticated) {
      token.save(kc.token);
      setInterval(() => {
        kc.updateToken(minValiditySeconds).error(() => kc.logout());
        token.save(kc.token);
      }, refreshRateMs);
      const userInfo = {
        logoutUrl: kc.createLogoutUrl(options),
        familyName: kc.idTokenParsed.family_name,
        givenName: kc.idTokenParsed.given_name,
        email: kc.idTokenParsed.email,
        organisationId: kc.idTokenParsed.organisationID.toString(),
        username: kc.idTokenParsed.preferred_username,
        isAdmin: isAdmin(kc.tokenParsed)
      };
      renderIndex(userInfo);
    } else {
      kc.login();
    }
  });
};

if (process.env.NODE_ENV === 'development') {
  const userInfo = {
    familyName: 'Nordmann',
    givenName: 'Ola',
    email: 'ola.nordmann@entur.org',
    organisationId: '1',
    username: 'ola.nordmann',
    isAdmin: true
  };
  renderIndex(userInfo);
} else {
  initAuth();
}
