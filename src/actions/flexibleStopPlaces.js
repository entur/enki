import {
  getFlexibleStopPlaceByIdQuery,
  getFlexibleStopPlacesQuery
} from '../graphql/uttu/queries';
import { UttuQuery } from '../graphql';
import { FlexibleStopPlace } from '../model';
import {
  showErrorNotification,
  showSuccessNotification
} from '../components/Notification/actions';
import {
  deleteFlexibleStopPlace,
  flexibleStopPlaceMutation
} from '../graphql/uttu/mutations';
import { getUttuError, getInternationalizedUttuError } from '../helpers/uttu';
import { getIntl } from '../i18n';
import messages from './flexibleStopPlaces.messages';

export const REQUEST_FLEXIBLE_STOP_PLACES = 'REQUEST_FLEXIBLE_STOP_PLACES';
export const RECEIVE_FLEXIBLE_STOP_PLACES = 'RECEIVE_FLEXIBLE_STOP_PLACES';

const requestFlexibleStopPlaces = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACES
});

const receiveFlexibleStopPlaces = stopPlaces => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACES,
  stopPlaces
});

export const loadFlexibleStopPlaces = () => async (dispatch, getState) => {
  dispatch(requestFlexibleStopPlaces());

  const activeProvider = getState().providers.active;
  const intl = getIntl(getState());

  try {
    const data = await UttuQuery(activeProvider, getFlexibleStopPlacesQuery, {});
    const flexibleStopPlaces = data.flexibleStopPlaces.map(
      fsp => new FlexibleStopPlace(fsp)
    );
    dispatch(receiveFlexibleStopPlaces(flexibleStopPlaces));
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

export const loadFlexibleStopPlaceById = id => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getFlexibleStopPlaceByIdQuery, { id })
    .then(data =>
      Promise.resolve(new FlexibleStopPlace(data.flexibleStopPlace))
    )
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Laste stoppested',
          `En feil oppstod under lastingen av stoppestedet: ${getUttuError(e)}`
        )
      );
      return Promise.reject();
    });
};

export const saveFlexibleStopPlace = flexibleStopPlace => (
  dispatch,
  getState
) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, flexibleStopPlaceMutation, {
    input: flexibleStopPlace
  })
    .then(() => {
      dispatch(
        showSuccessNotification('Lagre stoppested', 'Stoppestedet ble lagret.')
      );
      return Promise.resolve();
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Lagre stoppested',
          `En feil oppstod under lagringen av stoppestedet: ${getUttuError(e)}`
        )
      );
      return Promise.reject();
    });
};

export const deleteFlexibleStopPlaceById = id => (dispatch, getState) => {
  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, deleteFlexibleStopPlace, { id })
    .then(() => {
      dispatch(
        showSuccessNotification(
          'Slette stoppested',
          'Stoppestedet ble slettet.'
        )
      );
      return Promise.resolve();
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Slette stoppested',
          `En feil oppstod under slettingen av stoppestedet: ${getUttuError(e)}`
        )
      );
      return Promise.reject();
    });
};
