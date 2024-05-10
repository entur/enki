import {
  AnyAction,
  ThunkAction,
  configureStore,
  combineReducers,
  ReducersMapObject,
} from '@reduxjs/toolkit';
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

const staticReducers = {
  notification,
  auth,
  organisations,
  providers,
  exports,
  networks,
  flexibleLines,
  flexibleStopPlaces,
  editor,
  config,
  intl,
  userContext,
};

const devMiddlewares =
  import.meta.env.NODE_ENV !== 'production'
    ? [immutableStateInvariantMiddleware()]
    : [];

export const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immmutableCheck: false,
      serializableCheck: false,
    }).concat(...devMiddlewares),
  enhancers: [sentryReduxEnhancer],
});

const asyncReducers: Record<string, any> = {};

export const injectReducer = (key: string, asyncReducer: any) => {
  asyncReducers[key] = asyncReducer;
  store.replaceReducer(createReducer(asyncReducers));
};

function createReducer(asyncReducers?: ReducersMapObject) {
  return combineReducers({
    ...staticReducers,
    ...asyncReducers,
  });
}

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
