import {
  FAILED_RECEIVING_PROVIDERS,
  RECEIVE_PROVIDERS,
} from 'actions/constants';
import { ReceiveProvidersAction } from 'actions/providers';
import Provider from 'model/Provider';
import { UnknownAction } from 'redux';

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
  action: UnknownAction,
): ProvidersState => {
  switch (action.type) {
    case RECEIVE_PROVIDERS: {
      const typedAction = action as ReceiveProvidersAction;
      return {
        ...state,
        providers: [...typedAction.payload.providers],
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
