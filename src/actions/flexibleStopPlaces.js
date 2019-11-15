import {
  getFlexibleStopPlaceByIdQuery,
  getFlexibleStopPlacesQuery
} from 'graphql/uttu/queries';
import { UttuQuery } from 'graphql';
import { FlexibleStopPlace } from 'model';
import {
  showErrorNotification,
  showSuccessNotification
} from 'components/Notification/actions';
import {
  deleteFlexibleStopPlace,
  flexibleStopPlaceMutation
} from 'graphql/uttu/mutations';
import { getInternationalizedUttuError } from 'helpers/uttu';
import { getIntl } from 'i18n';
import messages from './flexibleStopPlaces.messages';

export const REQUEST_FLEXIBLE_STOP_PLACES = 'REQUEST_FLEXIBLE_STOP_PLACES';
export const RECEIVE_FLEXIBLE_STOP_PLACES = 'RECEIVE_FLEXIBLE_STOP_PLACES';
export const REQUEST_FLEXIBLE_STOP_PLACE = 'REQUEST_FLEXIBLE_STOP_PLACE';
export const RECEIVE_FLEXIBLE_STOP_PLACE = 'RECEIVE_FLEXIBLE_STOP_PLACE';

const requestFlexibleStopPlacesActionCreator = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACES
});

const receiveFlexibleStopPlacesActionCreator = stopPlaces => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACES,
  stopPlaces
});

const requestFlexibleStopPlaceActionCreator = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACE
});

const receiveFlexibleStopPlaceActionCreator = stopPlace => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACE,
  stopPlace
});

export const loadFlexibleStopPlaces = () => async (dispatch, getState) => {
  dispatch(requestFlexibleStopPlacesActionCreator());

  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    const data = await UttuQuery(
      activeProvider,
      getFlexibleStopPlacesQuery,
      {}
    );
    const flexibleStopPlaces = data.flexibleStopPlaces.map(
      fsp => new FlexibleStopPlace(fsp)
    );
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

export const loadFlexibleStopPlaceById = id => async (dispatch, getState) => {
  dispatch(requestFlexibleStopPlaceActionCreator());

  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    const data = await UttuQuery(
      activeProvider,
      getFlexibleStopPlaceByIdQuery,
      { id }
    );
    dispatch(
      receiveFlexibleStopPlaceActionCreator(
        new FlexibleStopPlace(data.flexibleStopPlace)
      )
    );
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

export const saveFlexibleStopPlace = flexibleStopPlace => async (
  dispatch,
  getState
) => {
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

export const deleteFlexibleStopPlaceById = id => async (dispatch, getState) => {
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
