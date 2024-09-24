import { AppThunk, sentryCaptureException } from '../store/store';
import { StopPlace, UttuQuery } from '../api';
import { getStopPlacesQuery } from '../api/uttu/queries';
import { RECEIVE_SEARCHED_STOP_PLACES, RECEIVE_STOP_PLACES } from './constants';
import { VEHICLE_MODE } from '../model/enums';

const receiveStopPlacesActionCreator = (stopPlaces: StopPlace[]) => ({
  type: RECEIVE_STOP_PLACES,
  stopPlaces,
});

export const getStopPlaces =
  (transportMode?: VEHICLE_MODE): AppThunk =>
  async (dispatch, getState) => {
    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    const token = await getState().auth.getAccessToken();

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getStopPlacesQuery,
        { transportMode },
        token,
      );
      dispatch(receiveStopPlacesActionCreator(data.stopPlaces));
    } catch (e) {
      sentryCaptureException(e);
    }
  };

const receiveSearchedStopPlacesActionCreator = (stopPlaces: StopPlace[]) => ({
  type: RECEIVE_SEARCHED_STOP_PLACES,
  stopPlaces,
});

export const searchStopPlaces =
  (transportMode: VEHICLE_MODE, searchText: string | undefined): AppThunk =>
  async (dispatch, getState) => {
    if (!searchText) {
      dispatch(receiveSearchedStopPlacesActionCreator([]));
      return;
    }

    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    const token = await getState().auth.getAccessToken();

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getStopPlacesQuery,
        { transportMode, searchText },
        token,
      );
      dispatch(receiveSearchedStopPlacesActionCreator(data.stopPlaces));
    } catch (e) {
      sentryCaptureException(e);
    }
  };

export const clearStopPlacesSearchResults =
  (): AppThunk => async (dispatch) => {
    dispatch(receiveSearchedStopPlacesActionCreator([]));
  };
