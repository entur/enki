import { UttuQuery } from 'api';
import { getOrganisationsQuery } from 'api/uttu/queries';
import { Organisation } from 'model/Organisation';
import { AppThunk } from 'store/store';

import { RECEIVE_ORGANISATIONS } from './constants';

export type ReceiveOrganisations = {
  type: typeof RECEIVE_ORGANISATIONS;
  organisations: Organisation[];
};

export type OrganisationsAction = ReceiveOrganisations;

export const receiveOrganisations = (
  organisations: Organisation[],
): ReceiveOrganisations => ({
  type: RECEIVE_ORGANISATIONS,
  organisations,
});

export const getOrganisations = (): AppThunk => async (dispatch, getState) => {
  try {
    const activeProvider = getState().userContext.activeProviderCode ?? '';
    if (!activeProvider) {
      return;
    }
    const { organisations } = await UttuQuery(
      getState().config.uttuApiUrl,
      activeProvider,
      getOrganisationsQuery,
      {},
      await getState().auth.getAccessToken(),
    );
    dispatch(receiveOrganisations(organisations));
  } catch {
    // Error intentionally ignored - organisations are non-critical
  }
};
