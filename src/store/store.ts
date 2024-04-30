import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import auth from 'auth/authSlice';
import config from 'config/configSlice';
import intl from 'i18n/intlSlice';
import reducers from 'reducers';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';
import userContext from '../auth/userContextSlice';

export const sentryCaptureException = (e: any) =>
  import.meta.env.NODE_ENV === 'production'
    ? Sentry.captureException(e)
    : console.error({ e });

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

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

const devMiddlewares =
  import.meta.env.NODE_ENV !== 'production'
    ? [immutableStateInvariantMiddleware()]
    : [];

export const store = configureStore({
  reducer: {
    auth,
    userContext,
    config,
    intl,
    notification,
    organisations,
    providers,
    exports,
    networks,
    flexibleLines,
    flexibleStopPlaces,
    editor,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immmutableCheck: false,
      serializableCheck: false,
    }).concat(...devMiddlewares),
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
