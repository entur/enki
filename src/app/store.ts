import { configureStore, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import configSlice from 'features/app/configSlice';
import authSlice from 'features/app/authSlice';
import reducers from 'reducers';
import * as Sentry from '@sentry/react';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';
import intlSlice from 'features/app/intlSlice';

export const sentryCaptureException = (e: any) =>
  process.env.NODE_ENV === 'production'
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
  process.env.NODE_ENV !== 'production'
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
