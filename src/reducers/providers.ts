import {
  FAILED_RECEIVING_PROVIDERS,
  RECEIVE_PROVIDERS,
  SET_ACTIVE_PROVIDER,
} from 'actions/constants';
import Provider from 'model/Provider';
import { AnyAction } from 'redux';

export type ProvidersState = {
  providers: Provider[] | null;
  failure: boolean;
  exports: null;
};

export const initialState = {
  providers: null,
  failure: false,
  active: null,
  exports: null,
};

const providersReducer = (
  state: ProvidersState = initialState,
  action: AnyAction,
): ProvidersState => {
  switch (action.type) {
    case RECEIVE_PROVIDERS: {
      return {
        ...state,
        providers: [...action.payload.providers],
      };
    }

    case FAILED_RECEIVING_PROVIDERS:
      return {
        ...state,
        failure: true,
      };

    default:
      return state;
  }
};

export default providersReducer;
