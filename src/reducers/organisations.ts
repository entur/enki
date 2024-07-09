import { RECEIVE_ORGANISATIONS } from 'actions/constants';
import { Organisation } from 'model/Organisation';
import { AnyAction } from 'redux';

export type OrganisationState = Organisation[] | null;

const organisationsReducer = (
  state: OrganisationState = null,
  action: AnyAction,
) => {
  switch (action.type) {
    case RECEIVE_ORGANISATIONS: {
      return !state ? [...action.organisations] : state;
    }

    default:
      return state;
  }
};

export default organisationsReducer;
