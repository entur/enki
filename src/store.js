import { applyMiddleware, createStore, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { intlReducer as intl } from 'react-intl-redux';
import Raven from 'raven-js';

import reducers from 'reducers';
import { geti18n, loadLocaleData, getIntl } from 'i18n/';
import { normalizeAllUrls } from 'helpers/url';

const SENTRY_DSN = 'https://cc3cacbc67234cc7bfe1cf391010414b@sentry.io/1769954';

const getMiddlewares = () => {
  const middlewares = [thunk.withExtraArgument({ intl: getIntl })];

  if (process.env.NODE_ENV === 'development') {
    const { createLogger } = require('redux-logger');
    const logger = createLogger({
      duration: true
    });
    middlewares.push(logger);
  }

  const useSentry = process.env.NODE_ENV === 'production';
  if (useSentry) {
    Raven.config(SENTRY_DSN, {
      release: process.env.IMAGE_TAG,
      stacktrace: true,
      environment: process.env.NODE_ENV,
      dataCallback: normalizeAllUrls
    }).install();
    const createRavenMiddleware = require('redux-raven-middleware');
    middlewares.push(createRavenMiddleware(Raven));
  }
  return middlewares;
};

export const configureStore = user => {
  const combinedReducers = combineReducers({
    ...reducers,
    intl
  });
  loadLocaleData();
  const { locale, messages } = geti18n();

  const initialState = {
    intl: {
      locale,
      messages
    },
    user
  };

  const middlewares = getMiddlewares();
  const enhancer = applyMiddleware(...middlewares);

  return {
    store: createStore(combinedReducers, initialState, enhancer),
    Raven
  };
};
