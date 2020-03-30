import { applyMiddleware, createStore, combineReducers } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
import thunk from 'redux-thunk';
import { intlReducer as intl } from 'react-intl-redux';
import * as Sentry from '@sentry/browser';
import createSentryMiddleware from 'redux-sentry-middleware';

import reducers from 'reducers';
import { geti18n, getIntl } from 'i18n';
import { normalizeAllUrls } from 'helpers/url';

const SENTRY_DSN = 'https://cc3cacbc67234cc7bfe1cf391010414b@sentry.io/1769954';

const getMiddlewares = () => {
  const middlewares = [thunk.withExtraArgument({ intl: getIntl })];

  const useSentry = process.env.NODE_ENV === 'production';
  if (useSentry) {
    Sentry.init({
      dsn: SENTRY_DSN,
      release: process.env.IMAGE_TAG,
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

export const configureStore = (user) => {
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
    user,
  };

  const middlewares = getMiddlewares();
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
