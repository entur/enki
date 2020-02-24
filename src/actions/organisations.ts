import http from 'http/http';
import { OrganisationState } from 'reducers/organisations';

export const RECEIVE_ORGANISATIONS = 'RECEIVE_ORGANISATIONS';

export type ReceiveOrganisations = {
  type: typeof RECEIVE_ORGANISATIONS;
  organisations: OrganisationState;
};

export const receiveOrganisations = (
  organisations: OrganisationState
): ReceiveOrganisations => ({
  type: RECEIVE_ORGANISATIONS,
  organisations
});

export const getOrganisations = (types: any) => (
  dispatch: (receiveOrganisations: ReceiveOrganisations) => void
) => {
  let typesQuery = types
    ? '?types' + (Array.isArray(types) ? types.join(',') : types)
    : '';
  return http.get(`/organisations${typesQuery}`).then(response => {
    dispatch(receiveOrganisations(response.data));
    return Promise.resolve(response.data);
  });
};
