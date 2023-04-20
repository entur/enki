import { configureStore, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import configSlice from 'features/app/configSlice';
import authSlice from 'features/app/authSlice';
import { intlReducer as intl } from 'react-intl-redux';
import reducers from 'reducers';
import { geti18n, getIntl } from 'i18n';
import thunk from 'redux-thunk';
import * as Sentry from '@sentry/react';

export const sentryCaptureException = (e: any) =>
  process.env.NODE_ENV === 'production'
    ? Sentry.captureException(e)
    : console.error({ e });

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

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
  enhancers: [sentryReduxEnhancer],
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
