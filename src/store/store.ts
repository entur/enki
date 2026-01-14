import {
  UnknownAction,
  ThunkAction,
  configureStore,
  combineReducers,
  ReducersMapObject,
} from '@reduxjs/toolkit';
import auth from 'auth/authSlice';
import config from 'config/configSlice';
import intl from 'i18n/intlSlice';
import reducers from 'reducers';
import userContext from '../auth/userContextSlice';

const {
  notification,
  organisations,
  providers,
  exports,
  networks,
  brandings,
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
  brandings,
  flexibleLines,
  flexibleStopPlaces,
  editor,
  config,
  intl,
  userContext,
};

export const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: import.meta.env.NODE_ENV !== 'production',
      serializableCheck: false,
    }),
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

// AppThunk type for async thunk action creators
// Default return type is Promise<void> since most thunks are async functions
export type AppThunk<ReturnType = Promise<void>> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;
