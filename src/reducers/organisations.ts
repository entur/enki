import {
  RECEIVE_ORGANISATIONS,
  ReceiveOrganisations,
} from 'actions/organisations';
import { ORGANISATION_TYPE } from 'model/enums';
import Provider from 'model/Provider';

type ContactInfo = {
  url: string;
  email: string;
  phone: string;
};

export type OrganisationState = Organisation[] | null;

export type Organisation = {
  id: string;
  name: string;
  legalName: string | null;
  types: ORGANISATION_TYPE[];
  contact: ContactInfo | null;
  customerContact: ContactInfo | null;
  logo: string | null;
  references: { [key in string | number]: string };
  version: number;
};

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

export const filterAuthorities = (
  organisations: Organisation[],
  activeProvider: Provider | null
) =>
  organisations.filter(
    (org) =>
      org.references.netexAuthorityId &&
      org.references.codeSpace === activeProvider?.codespace?.xmlns
  );

export const filterNetexOperators = (
  organisations: Organisation[]
): Organisation[] =>
  organisations.filter((org) => org.references.netexOperatorId);

export default organisationsReducer;
