import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import { UttuQuery } from 'api';
import {
  deleteFlexibleStopPlace,
  flexibleStopPlaceMutation,
} from 'api/uttu/mutations';
import {
  getFlexibleStopPlaceByIdQuery,
  getFlexibleStopPlacesQuery,
} from 'api/uttu/queries';
import { RootState } from 'store/store';
import { getInternationalizedUttuError } from 'helpers/uttu';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { Dispatch } from 'react';
import { IntlShape } from 'react-intl';
import {
  requestFlexibleStopPlaces,
  receiveFlexibleStopPlaces,
  requestFlexibleStopPlace,
  receiveFlexibleStopPlace,
} from '../reducers/flexibleStopPlacesSlice';

// Re-export actions from slice
export {
  requestFlexibleStopPlaces,
  receiveFlexibleStopPlaces,
  requestFlexibleStopPlace,
  receiveFlexibleStopPlace,
};

export const loadFlexibleStopPlaces =
  (intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requestFlexibleStopPlaces());

    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getFlexibleStopPlacesQuery,
        {},
        await getState().auth.getAccessToken(),
      );
      const flexibleStopPlaces = data.flexibleStopPlaces;
      dispatch(receiveFlexibleStopPlaces(flexibleStopPlaces));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesLoadStopPlacesErrorHeader',
          }),
          intl.formatMessage(
            {
              id: 'flexibleStopPlacesLoadStopPlacesErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const loadFlexibleStopPlaceById =
  (id: string, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => RootState) => {
    dispatch(requestFlexibleStopPlace());

    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getFlexibleStopPlaceByIdQuery,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(receiveFlexibleStopPlace(data.flexibleStopPlace));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesLoadStopPlaceErrorHeader',
          }),
          intl.formatMessage(
            {
              id: 'flexibleStopPlacesLoadStopPlaceErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const saveFlexibleStopPlace =
  (flexibleStopPlace: FlexibleStopPlace, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        flexibleStopPlaceMutation,
        {
          input: flexibleStopPlace,
        },
        await getState().auth.getAccessToken(),
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesSaveStopPlaceSuccessHeader',
          }),
          intl.formatMessage({
            id: 'flexibleStopPlacesSaveStopPlaceSuccessMessage',
          }),
        ),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesSaveStopPlaceErrorHeader',
          }),
          intl.formatMessage(
            {
              id: 'flexibleStopPlacesSaveStopPlaceErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };

export const deleteFlexibleStopPlaceById =
  (id: string, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => RootState) => {
    const activeProvider = getState().userContext.activeProviderCode ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        deleteFlexibleStopPlace,
        { id },
        await getState().auth.getAccessToken(),
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesDeleteStopPlaceSuccessHeader',
          }),
          intl.formatMessage({
            id: 'flexibleStopPlacesDeleteStopPlaceSuccessMessage',
          }),
        ),
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesDeleteStopPlaceErrorHeader',
          }),
          intl.formatMessage(
            {
              id: 'flexibleStopPlacesDeleteStopPlaceErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) },
          ),
        ),
      );
    }
  };
