import {
  getFlexibleStopPlaceByIdQuery,
  getFlexibleStopPlacesQuery
} from 'graphql/uttu/queries';
import { UttuQuery } from 'graphql';
import {
  showErrorNotification,
  showSuccessNotification
} from 'actions/notification';
import {
  deleteFlexibleStopPlace,
  flexibleStopPlaceMutation
} from 'graphql/uttu/mutations';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { getIntl } from 'i18n';
import messages from './flexibleStopPlaces.messages';
import { Dispatch } from 'react';
import { GlobalState } from 'reducers';
import FlexibleStopPlace from 'model/FlexibleStopPlace';

export const REQUEST_FLEXIBLE_STOP_PLACES = 'REQUEST_FLEXIBLE_STOP_PLACES';
export const RECEIVE_FLEXIBLE_STOP_PLACES = 'RECEIVE_FLEXIBLE_STOP_PLACES';
export const REQUEST_FLEXIBLE_STOP_PLACE = 'REQUEST_FLEXIBLE_STOP_PLACE';
export const RECEIVE_FLEXIBLE_STOP_PLACE = 'RECEIVE_FLEXIBLE_STOP_PLACE';

const requestFlexibleStopPlacesActionCreator = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACES
});

const receiveFlexibleStopPlacesActionCreator = (
  stopPlaces: FlexibleStopPlace[]
) => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACES,
  stopPlaces
});

const requestFlexibleStopPlaceActionCreator = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACE
});

const receiveFlexibleStopPlaceActionCreator = (
  stopPlace: FlexibleStopPlace
) => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACE,
  stopPlace
});

export const loadFlexibleStopPlaces = () => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  dispatch(requestFlexibleStopPlacesActionCreator());

  const activeProvider = getState().providers.active;
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
        intl.formatMessage(messages.loadStopPlacesErrorHeader),
        intl.formatMessage(messages.loadStopPlacesErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
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

  const activeProvider = getState().providers.active;
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
        intl.formatMessage(messages.loadStopPlaceErrorHeader),
        intl.formatMessage(messages.loadStopPlaceErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};

export const saveFlexibleStopPlace = (
  flexibleStopPlace: FlexibleStopPlace
) => async (dispatch: Dispatch<any>, getState: () => GlobalState) => {
  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    await UttuQuery(activeProvider, flexibleStopPlaceMutation, {
      input: flexibleStopPlace
    });
    dispatch(
      showSuccessNotification(
        intl.formatMessage(messages.saveStopPlaceSuccessHeader),
        intl.formatMessage(messages.saveStopPlaceSuccessMessage)
      )
    );
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.saveStopPlaceErrorHeader),
        intl.formatMessage(messages.saveStopPlaceErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};

export const deleteFlexibleStopPlaceById = (id: string) => async (
  dispatch: Dispatch<any>,
  getState: () => GlobalState
) => {
  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());
  try {
    await UttuQuery(activeProvider, deleteFlexibleStopPlace, { id });
    dispatch(
      showSuccessNotification(
        intl.formatMessage(messages.deleteStopPlaceSuccessHeader),
        intl.formatMessage(messages.deleteStopPlaceSuccessMessage)
      )
    );
  } catch (e) {
    dispatch(
      showErrorNotification(
        intl.formatMessage(messages.deleteStopPlaceErrorHeader),
        intl.formatMessage(messages.deleteStopPlaceErrorMessage, {
          details: getInternationalizedUttuError(intl, e)
        })
      )
    );
    throw e;
  }
};
