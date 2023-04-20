import { configureStore, ThunkAction, AnyAction } from '@reduxjs/toolkit';
import configSlice from 'features/app/configSlice';
import authSlice from 'features/app/authSlice';
import { intlReducer as intl } from 'react-intl-redux';
import reducers from 'reducers';
import * as Sentry from '@sentry/react';
import immutableStateInvariantMiddleware from 'redux-immutable-state-invariant';
import { getLocale, getMessages } from 'i18n';

export const sentryCaptureException = (e: any) =>
  process.env.NODE_ENV === 'production'
    ? Sentry.captureException(e)
    : console.error({ e });

const sentryReduxEnhancer = Sentry.createReduxEnhancer({
  // Optionally pass options listed below
});

const locale = getLocale();
const messages = getMessages(locale);

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
      // thunk: {
      //   extraArgument: { intl: getIntl },
      // },
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
