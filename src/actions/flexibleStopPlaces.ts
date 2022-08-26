import {
  getFlexibleStopPlaceByIdQuery,
  getFlexibleStopPlacesQuery,
} from 'api/uttu/queries';
import { UttuQuery } from 'api';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import {
  deleteFlexibleStopPlace,
  flexibleStopPlaceMutation,
} from 'api/uttu/mutations';
import { getIntl } from 'i18n';
import { Dispatch } from 'react';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { sentryCaptureException } from 'store';

export const REQUEST_FLEXIBLE_STOP_PLACES = 'REQUEST_FLEXIBLE_STOP_PLACES';
export const RECEIVE_FLEXIBLE_STOP_PLACES = 'RECEIVE_FLEXIBLE_STOP_PLACES';
export const REQUEST_FLEXIBLE_STOP_PLACE = 'REQUEST_FLEXIBLE_STOP_PLACE';
export const RECEIVE_FLEXIBLE_STOP_PLACE = 'RECEIVE_FLEXIBLE_STOP_PLACE';

const requestFlexibleStopPlacesActionCreator = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACES,
});

const receiveFlexibleStopPlacesActionCreator = (
  stopPlaces: FlexibleStopPlace[]
) => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACES,
  stopPlaces,
});

const requestFlexibleStopPlaceActionCreator = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACE,
});

const receiveFlexibleStopPlaceActionCreator = (
  stopPlace: FlexibleStopPlace
) => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACE,
  stopPlace,
});

export const loadFlexibleStopPlaces =
  () => async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    dispatch(requestFlexibleStopPlacesActionCreator());

    const activeProvider = getState().providers.active?.code ?? '';
    const intl = getIntl(getState());

    try {
      const data = await UttuQuery(
        activeProvider,
        getFlexibleStopPlacesQuery,
        {},
        await getState().auth.getAccessToken()
      );
      const flexibleStopPlaces = data.flexibleStopPlaces;
      dispatch(receiveFlexibleStopPlacesActionCreator(flexibleStopPlaces));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage('flexibleStopPlacesLoadStopPlacesErrorHeader'),
          intl.formatMessage(
            'flexibleStopPlacesLoadStopPlacesErrorMessage',
            getInternationalizedUttuError(intl, e)
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const loadFlexibleStopPlaceById =
  (id: string) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    dispatch(requestFlexibleStopPlaceActionCreator());

    const activeProvider = getState().providers.active?.code ?? '';
    const intl = getIntl(getState());

    try {
      const data = await UttuQuery(
        activeProvider,
        getFlexibleStopPlaceByIdQuery,
        { id },
        await getState().auth.getAccessToken()
      );
      dispatch(receiveFlexibleStopPlaceActionCreator(data.flexibleStopPlace));
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage('flexibleStopPlacesLoadStopPlaceErrorHeader'),
          intl.formatMessage(
            'flexibleStopPlacesLoadStopPlaceErrorMessage',
            getInternationalizedUttuError(intl, e)
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const saveFlexibleStopPlace =
  (flexibleStopPlace: FlexibleStopPlace) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    const activeProvider = getState().providers.active?.code ?? '';
    const intl = getIntl(getState());

    try {
      await UttuQuery(
        activeProvider,
        flexibleStopPlaceMutation,
        {
          input: flexibleStopPlace,
        },
        await getState().auth.getAccessToken()
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage('flexibleStopPlacesSaveStopPlaceSuccessHeader'),
          intl.formatMessage('flexibleStopPlacesSaveStopPlaceSuccessMessage')
        )
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage('flexibleStopPlacesSaveStopPlaceErrorHeader'),
          intl.formatMessage(
            'flexibleStopPlacesSaveStopPlaceErrorMessage',
            getInternationalizedUttuError(intl, e)
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const deleteFlexibleStopPlaceById =
  (id: string) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    const activeProvider = getState().providers.active?.code ?? '';
    const intl = getIntl(getState());
    try {
      await UttuQuery(
        activeProvider,
        deleteFlexibleStopPlace,
        { id },
        await getState().auth.getAccessToken()
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage('flexibleStopPlacesDeleteStopPlaceSuccessHeader'),
          intl.formatMessage('flexibleStopPlacesDeleteStopPlaceSuccessMessage')
        )
      );
    } catch (e) {
      dispatch(
        showErrorNotification(
          intl.formatMessage('flexibleStopPlacesDeleteStopPlaceErrorHeader'),
          intl.formatMessage(
            'flexibleStopPlacesDeleteStopPlaceErrorMessage',
            getInternationalizedUttuError(intl, e)
          )
        )
      );
      sentryCaptureException(e);
    }
  };
