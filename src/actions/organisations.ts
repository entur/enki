import { OrganisationState } from 'reducers/organisations';
import { GlobalState } from 'reducers';
import { UttuQuery } from 'api';
import { getOrganisationsQuery } from 'api/uttu/queries';
import { sentryCaptureException } from 'store';

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
  () =>
  async (
    dispatch: (receiveOrganisations: ReceiveOrganisations) => void,
    getState: () => GlobalState
  ) => {
    try {
      const activeProvider = getState().providers.active?.code ?? '';
      if (!activeProvider) {
        return;
      }
      const { organisations } = await UttuQuery(
        activeProvider,
        getOrganisationsQuery,
        {},
        await getState().auth.getAccessToken()
      );
      dispatch(receiveOrganisations(organisations));
    } catch (e) {
      sentryCaptureException(e);
    }
  };
