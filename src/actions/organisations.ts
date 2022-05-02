import http from 'http/http';
import { OrganisationState } from 'reducers/organisations';
import { ORGANISATION_TYPE } from 'model/enums';
import { GlobalState } from 'reducers';

export const RECEIVE_ORGANISATIONS = 'RECEIVE_ORGANISATIONS';

export type ReceiveOrganisations = {
  type: typeof RECEIVE_ORGANISATIONS;
  organisations: OrganisationState;
};

export const receiveOrganisations = (
  organisations: OrganisationState
): ReceiveOrganisations => ({
  type: RECEIVE_ORGANISATIONS,
  organisations,
});

export const getOrganisations =
  (types?: ORGANISATION_TYPE[]) =>
  async (
    dispatch: (receiveOrganisations: ReceiveOrganisations) => void,
    getState: () => GlobalState
  ) => {
    const typesQuery = types?.length ? '?types' + types.join(',') : '';
    return http
      .get(`/organisations${typesQuery}`, {
        headers: {
          Authorization: `Bearer ${await getState().auth.getAccessToken()}`,
        },
      })
      .then((response) => {
        dispatch(receiveOrganisations(response.data));
        return Promise.resolve(response.data);
      });
  };
