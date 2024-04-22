import { AnyAction, ThunkAction, configureStore } from '@reduxjs/toolkit';
import * as Sentry from '@sentry/react';
import authSlice from 'features/app/authSlice';
import configSlice from 'features/app/configSlice';
import intlSlice from 'i18n/intlSlice';
import reducers from 'reducers';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';

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
    intl: intlSlice,
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
