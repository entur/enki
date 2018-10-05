import {
  RECEIVE_ORGANISATIONS,
  SET_ACTIVE_ORGANISATION
} from '../actions/organisations';

const initialState = {
  organisations: []
};

const organisationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECEIVE_ORGANISATIONS:
      return Object.assign({}, state, {
        organisations: action.organisations
      });

    case SET_ACTIVE_ORGANISATION:
      return Object.assign({}, state, {
        active: action.organisation
      });

    default:
      return state;
  }
};

export default organisationsReducer;
