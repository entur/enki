import { AppThunk, sentryCaptureException } from '../store/store';
import { StopPlace, UttuQuery } from '../api';
import { getStopPlacesQuery } from '../api/uttu/queries';
import { RECEIVE_STOP_PLACES } from './constants';
import { receiveOrganisations } from './organisations';

const receiveStopPlacesActionCreator = (stopPlaces: StopPlace[]) => ({
  type: RECEIVE_STOP_PLACES,
  stopPlaces,
});

export const getStopPlaces = (): AppThunk => async (dispatch, getState) => {
  const activeProvider = getState().userContext.activeProviderCode ?? '';
  const uttuApiUrl = getState().config.uttuApiUrl;
  const token = await getState().auth.getAccessToken();

  try {
    const data = await UttuQuery(
      uttuApiUrl,
      activeProvider,
      getStopPlacesQuery,
      {},
      token,
    );
    dispatch(receiveStopPlacesActionCreator(data.stopPlaces));
    dispatch(receiveOrganisations([]));
  } catch (e) {
    sentryCaptureException(e);
  }
};
