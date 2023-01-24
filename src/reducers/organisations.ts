import {
  RECEIVE_ORGANISATIONS,
  ReceiveOrganisations,
} from 'actions/organisations';
import { Organisation } from 'model/Organisation';
import Provider from 'model/Provider';

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

/**
 * Legacy behavior: Filter out organisations that do not have a netexAuthorityId with current provider's codespace
 */
export const filterAuthorities = (
  organisations: Organisation[],
  activeProvider: Provider | null
) =>
  organisations.filter((org) =>
    org.keyList?.keyValue
      ?.find((kv) => kv.key === 'LegacyId')
      ?.value?.split(',')
      .find((v) => v.indexOf('Authority'))
      ?.startsWith(activeProvider?.codespace?.xmlns || 'INVALID')
  );

/**
 * Legacy behavior: Filter out organisations that do not have a netexOperatorId
 */
export const filterNetexOperators = (
  organisations: Organisation[]
): Organisation[] =>
  organisations.filter(
    (org) =>
      org.keyList?.keyValue
        ?.find((kv) => kv.key === 'LegacyId')
        ?.value?.split(',')
        .find((v) => v.indexOf('Authority')) !== undefined
  );

export default organisationsReducer;
