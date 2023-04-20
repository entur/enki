import { AnyAction } from 'redux';
import Provider from 'model/Provider';
import {
  FAILED_RECEIVING_PROVIDERS,
  RECEIVE_PROVIDERS,
  SET_ACTIVE_PROVIDER,
} from 'actions/constants';

export type ProvidersState = {
  providers: Provider[] | null;
  failure: boolean;
  active: Provider | null;
  exports: null;
};

export const initialState = {
  providers: null,
  failure: false,
  active: null,
  exports: null,
};

const getActiveProvider = (
  state: ProvidersState = initialState,
  action: AnyAction
): Provider | null => {
  if (!state.active && action.payload.activeCode) {
    return action.payload.providers.find(
      (p: Provider) => p.code === action.payload.activeCode
    );
  } else if (!state.active && action.payload.providers.length > 0) {
    return action.payload.providers[0];
  } else {
    return state.active;
  }
};

const providersReducer = (
  state: ProvidersState = initialState,
  action: AnyAction
): ProvidersState => {
  switch (action.type) {
    case RECEIVE_PROVIDERS: {
      return {
        ...state,
        providers: action.payload.providers,
        active: getActiveProvider(state, action),
      };
    }

    case FAILED_RECEIVING_PROVIDERS:
      return {
        ...state,
        failure: true,
      };

    case SET_ACTIVE_PROVIDER:
      return { ...state, active: action.provider };

    default:
      return state;
  }
};

export default providersReducer;
