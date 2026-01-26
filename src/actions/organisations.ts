import { UttuQuery } from 'api';
import { getOrganisationsQuery } from 'api/uttu/queries';
import { AppThunk } from 'store/store';
import { receiveOrganisations } from '../reducers/organisationsSlice';

// Re-export action from slice
export { receiveOrganisations };

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
