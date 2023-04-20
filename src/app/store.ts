import { configureStore, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import configSlice from 'features/app/configSlice';
import authSlice from 'features/app/authSlice';
import { intlReducer as intl } from 'react-intl-redux';
import reducers from 'reducers';
import { geti18n, getIntl } from 'i18n';
import thunk from 'redux-thunk';

// import { applyMiddleware, createStore, combineReducers } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// import * as Sentry from '@sentry/browser';
// import createSentryMiddleware from 'redux-sentry-middleware';
// import { normalizeAllUrls } from 'utils/sentry';
//import { captureException } from '@sentry/browser';
//let useSentry = false;
// const getMiddlewares = (sentryDsn) => {
//   if (process.env.NODE_ENV === 'production' && sentryDsn) {
//     useSentry = true;
//     Sentry.init({
//       dsn: sentryDsn,
//       release: process.env.REACT_APP_VERSION,
//       attachStacktrace: true,
//       environment: process.env.NODE_ENV,
//       beforeSend(e) {
//         return normalizeAllUrls(e);
//       },
//     });
//     middlewares.push(createSentryMiddleware(Sentry));
//   }
//   return middlewares;
// };

export const sentryCaptureException = (e: any) => console.error({ e });
//useSentry ? captureException(e) : console.error({ e });

const { locale, messages } = geti18n();

const {
  notification,
  organisations,
  providers,
  exports,
  networks,
  flexibleLines,
  flexibleStopPlaces,
  editor,
} = reducers;

const middlewares = [thunk.withExtraArgument({ intl: getIntl })];

const devMiddlewares =
  process.env.NODE_ENV !== 'production'
    ? [require('redux-immutable-state-invariant').default(), thunk]
    : [thunk];

export const store = configureStore({
  reducer: {
    notification,
    auth: authSlice,
    organisations,
    providers,
    exports,
    networks,
    flexibleLines,
    flexibleStopPlaces,
    editor,
    config: configSlice,
    intl,
  },
  preloadedState: {
    intl: {
      locale,
      messages,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: true,
      immmutableCheck: false,
      serializableCheck: false,
    }).concat(...devMiddlewares, ...middlewares),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
