import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import { intlReducer as intl } from 'react-intl-redux';
import * as Sentry from '@sentry/browser';
import createSentryMiddleware from 'redux-sentry-middleware';

import reducers from 'reducers';
import { geti18n, getIntl } from 'i18n';
import { normalizeAllUrls } from 'helpers/url';
import { captureException } from '@sentry/browser';

let useSentry = false;

const getMiddlewares = (sentryDsn) => {
  const middlewares = [thunk.withExtraArgument({ intl: getIntl })];

  if (process.env.NODE_ENV === 'production' && sentryDsn) {
    useSentry = true;
    Sentry.init({
      dsn: sentryDsn,
      release: process.env.REACT_APP_VERSION,
      attachStacktrace: true,
      environment: process.env.NODE_ENV,
      beforeSend(e) {
        return normalizeAllUrls(e);
      },
    });
    middlewares.push(createSentryMiddleware(Sentry));
  }
  return middlewares;
};

export const sentryCaptureException = (e) =>
  useSentry ? captureException(e) : console.error({ e });

export const configureStore = (auth, config) => {
  const combinedReducers = combineReducers({
    ...reducers,
    intl,
  });
  const { locale, messages } = geti18n();

  const initialState = {
    intl: {
      locale,
      messages,
    },
    auth,
    config,
  };

  const middlewares = getMiddlewares(config.sentryDsn);
  const enhancer = applyMiddleware(...middlewares);

  return {
    store: createStore(
      combinedReducers,
      initialState,
      composeWithDevTools(enhancer)
    ),
    sentry: Sentry,
  };
};
