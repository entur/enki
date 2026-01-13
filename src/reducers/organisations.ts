import { RECEIVE_ORGANISATIONS } from 'actions/constants';
import { OrganisationsAction } from 'actions/organisations';
import { Organisation } from 'model/Organisation';
import { UnknownAction } from 'redux';

export type OrganisationState = Organisation[] | null;

const organisationsReducer = (
  state: OrganisationState = null,
  action: UnknownAction,
) => {
  switch (action.type) {
    case RECEIVE_ORGANISATIONS:
      return [...(action as OrganisationsAction).organisations];

    default:
      return state;
  }
};

export default organisationsReducer;
