import {
  RECEIVE_ORGANISATIONS,
  ReceiveOrganisations,
} from 'actions/organisations';
import { Organisation } from 'model/Organisation';

export type OrganisationState = Organisation[] | null;

const organisationsReducer = (
  state: OrganisationState = null,
  action: ReceiveOrganisations
) => {
  switch (action.type) {
    case RECEIVE_ORGANISATIONS:
      return action.organisations;

    default:
      return state;
  }
};

export default organisationsReducer;
