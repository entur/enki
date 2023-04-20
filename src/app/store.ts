import { configureStore, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import configSlice from 'features/app/configSlice';
import authSlice from 'features/app/authSlice';

// import { applyMiddleware, createStore, combineReducers } from 'redux';
// import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';
// import thunk from 'redux-thunk';
import { intlReducer as intl } from 'react-intl-redux';
// import * as Sentry from '@sentry/browser';
// import createSentryMiddleware from 'redux-sentry-middleware';

import reducers from 'reducers';
import { geti18n, getIntl } from 'i18n';
// import { normalizeAllUrls } from 'helpers/url';
import { captureException } from '@sentry/browser';

import { initialState as providersInitialState } from 'reducers/providers';

let useSentry = false;

// const getMiddlewares = (sentryDsn) => {
//   const middlewares = [thunk.withExtraArgument({ intl: getIntl })];

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

export const sentryCaptureException = (e: any) =>
  useSentry ? captureException(e) : console.error({ e });

// export const configureStore = (auth, config) => {
//   const combinedReducers = combineReducers({
//     ...reducers,
//     intl,
//   });
const { locale, messages } = geti18n();

//   const middlewares = getMiddlewares(config.sentryDsn);
//   const enhancer = applyMiddleware(...middlewares);

//   return {
//     store: createStore(
//       combinedReducers,
//       initialState,
//       composeWithDevTools(enhancer)
//     ),
//     sentry: Sentry,
//   };
// };

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

export const store = configureStore({
  // Automatically calls `combineReducers`
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
    providers: providersInitialState,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
