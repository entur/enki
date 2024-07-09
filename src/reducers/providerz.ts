import {
  FAILED_RECEIVING_PROVIDERS,
  RECEIVE_PROVIDERS,
} from 'actions/constants';
import Provider from 'model/Provider';
import { AnyAction } from 'redux';

export type ProviderzState = {
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

const providerzReducer = (
  state: ProviderzState = initialState,
  action: AnyAction,
): ProviderzState => {
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

export default providerzReducer;
