import { RECEIVE_ORGANISATIONS } from 'actions/organisations';

const organisationsReducer = (state = null, action) => {
  switch (action.type) {
    case RECEIVE_ORGANISATIONS:
      return action.organisations;

    default:
      return state;
  }
};

export default organisationsReducer;
