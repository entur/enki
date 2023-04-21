import { UttuQuery } from 'api';
import { getOrganisationsQuery } from 'api/uttu/queries';
import { AppThunk, sentryCaptureException } from 'app/store';
import { OrganisationState } from 'reducers/organisations';
import { RECEIVE_ORGANISATIONS } from './constants';

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

export const getOrganisations = (): AppThunk => async (dispatch, getState) => {
  try {
    const activeProvider = getState().providers.active?.code ?? '';
    if (!activeProvider) {
      return;
    }
    const { organisations } = await UttuQuery(
      getState().config.uttuApiUrl,
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
