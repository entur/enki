import {
  getFlexibleStopPlaceByIdQuery,
  getFlexibleStopPlacesQuery,
} from 'graphql/uttu/queries';
import { UttuQuery } from 'graphql';
import {
  showErrorNotification,
  showSuccessNotification,
} from 'actions/notification';
import {
  deleteFlexibleStopPlace,
  flexibleStopPlaceMutation,
} from 'graphql/uttu/mutations';
import { getIntl } from 'i18n';
import { Dispatch } from 'react';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import { getInternationalizedUttuError } from 'helpers/uttu';

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

export const loadFlexibleStopPlaces = () => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  dispatch(requestFlexibleStopPlacesActionCreator());

  const activeProvider = getState().providers.active?.code ?? '';
  const intl = getIntl(getState());

  try {
    const data = await UttuQuery(
      activeProvider,
      getFlexibleStopPlacesQuery,
      {}
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
    throw e;
  }
};

export const loadFlexibleStopPlaceById = (id: string) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  dispatch(requestFlexibleStopPlaceActionCreator());

  const activeProvider = getState().providers.active?.code ?? '';
  const intl = getIntl(getState());

  try {
    const data = await UttuQuery(
      activeProvider,
      getFlexibleStopPlaceByIdQuery,
      { id }
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
    throw e;
  }
};

export const saveFlexibleStopPlace = (
  flexibleStopPlace: FlexibleStopPlace
) => async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
  const activeProvider = getState().providers.active?.code ?? '';
  const intl = getIntl(getState());

  try {
    await UttuQuery(activeProvider, flexibleStopPlaceMutation, {
      input: flexibleStopPlace,
    });
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
    throw e;
  }
};

export const deleteFlexibleStopPlaceById = (id: string) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const activeProvider = getState().providers.active?.code ?? '';
  const intl = getIntl(getState());
  try {
    await UttuQuery(activeProvider, deleteFlexibleStopPlace, { id });
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
    throw e;
  }
};
