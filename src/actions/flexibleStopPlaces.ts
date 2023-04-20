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
import { Dispatch } from 'react';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { sentryCaptureException } from 'app/store';
import {
  RECEIVE_FLEXIBLE_STOP_PLACE,
  RECEIVE_FLEXIBLE_STOP_PLACES,
  REQUEST_FLEXIBLE_STOP_PLACE,
  REQUEST_FLEXIBLE_STOP_PLACES,
} from './constants';
import { IntlShape } from 'react-intl';

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
  (intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    dispatch(requestFlexibleStopPlacesActionCreator());

    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      const data = await UttuQuery(
        uttuApiUrl,
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
          intl.formatMessage({
            id: 'flexibleStopPlacesLoadStopPlacesErrorHeader',
          }),
          intl.formatMessage(
            {
              id: 'flexibleStopPlacesLoadStopPlacesErrorMessage',
            },
            { details: getInternationalizedUttuError(intl, e as Error) }
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const loadFlexibleStopPlaceById =
  (id: string, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    dispatch(requestFlexibleStopPlaceActionCreator());

    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      const data = await UttuQuery(
        uttuApiUrl,
        activeProvider,
        getFlexibleStopPlaceByIdQuery,
        { id },
        await getState().auth.getAccessToken()
      );
      dispatch(receiveFlexibleStopPlaceActionCreator(data.flexibleStopPlace));
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
            { details: getInternationalizedUttuError(intl, e as Error) }
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const saveFlexibleStopPlace =
  (flexibleStopPlace: FlexibleStopPlace, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;

    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        flexibleStopPlaceMutation,
        {
          input: flexibleStopPlace,
        },
        await getState().auth.getAccessToken()
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesSaveStopPlaceSuccessHeader',
          }),
          intl.formatMessage({
            id: 'flexibleStopPlacesSaveStopPlaceSuccessMessage',
          })
        )
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
            { details: getInternationalizedUttuError(intl, e as Error) }
          )
        )
      );
      sentryCaptureException(e);
    }
  };

export const deleteFlexibleStopPlaceById =
  (id: string, intl: IntlShape) =>
  async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
    const activeProvider = getState().providers.active?.code ?? '';
    const uttuApiUrl = getState().config.uttuApiUrl;
    try {
      await UttuQuery(
        uttuApiUrl,
        activeProvider,
        deleteFlexibleStopPlace,
        { id },
        await getState().auth.getAccessToken()
      );
      dispatch(
        showSuccessNotification(
          intl.formatMessage({
            id: 'flexibleStopPlacesDeleteStopPlaceSuccessHeader',
          }),
          intl.formatMessage({
            id: 'flexibleStopPlacesDeleteStopPlaceSuccessMessage',
          })
        )
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
            { details: getInternationalizedUttuError(intl, e as Error) }
          )
        )
      );
      sentryCaptureException(e);
    }
  };
