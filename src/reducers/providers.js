import {
  RECEIVE_PROVIDERS,
  FAILED_RECEIVING_PROVIDERS,
  SET_ACTIVE_PROVIDER
} from '../actions/providers';

const initialState = {
  providers: null,
  failure: false,
  active: null
};

const providersReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_PROVIDERS: {
      const active =
        !state.active && action.providers.length > 0
          ? action.providers[0].code
          : state.active;
      return Object.assign({}, state, {
        providers: action.providers,
        active
      });
    }

    case FAILED_RECEIVING_PROVIDERS:
      return Object.assign({}, state, {
        failure: true
      });

    case SET_ACTIVE_PROVIDER:
      return Object.assign({}, state, {
        active: action.provider
      });

    default:
      return state;
  }
};

export default providersReducer;
