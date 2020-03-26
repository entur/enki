import {
  RECEIVE_PROVIDERS,
  FAILED_RECEIVING_PROVIDERS,
  SET_ACTIVE_PROVIDER,
} from 'actions/providers';
import { AnyAction } from 'redux';
import Provider from 'model/Provider';

export type ProvidersState = {
  providers: Provider[] | null;
  failure: boolean;
  active: string | null;
  exports: null;
};

const initialState = {
  providers: null,
  failure: false,
  active: null,
  exports: null,
};

const providersReducer = (
  state: ProvidersState = initialState,
  action: AnyAction
): ProvidersState => {
  switch (action.type) {
    case RECEIVE_PROVIDERS: {
      const active =
        !state.active && action.providers.length > 0
          ? action.providers[0].code
          : state.active;
      return Object.assign({}, state, {
        providers: action.providers,
        active,
      });
    }

    case FAILED_RECEIVING_PROVIDERS:
      return Object.assign({}, state, { failure: true });

    case SET_ACTIVE_PROVIDER:
      return Object.assign({}, state, {
        active: action.provider,
      });

    default:
      return state;
  }
};

export default providersReducer;
