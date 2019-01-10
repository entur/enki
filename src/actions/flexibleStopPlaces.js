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

export const REQUEST_FLEXIBLE_STOP_PLACES = 'REQUEST_FLEXIBLE_STOP_PLACES';
export const RECEIVE_FLEXIBLE_STOP_PLACES = 'RECEIVE_FLEXIBLE_STOP_PLACES';

const requestFlexibleStopPlaces = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACES
});

const receiveFlexibleStopPlaces = stopPlaces => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACES,
  stopPlaces
});

export const loadFlexibleStopPlaces = () => (dispatch, getState) => {
  dispatch(requestFlexibleStopPlaces());

  const activeProvider = getState().providers.active;
  return UttuQuery(activeProvider, getFlexibleStopPlacesQuery, {})
    .then(data => {
      const flexibleStopPlaces = data.flexibleStopPlaces.map(
        fsp => new FlexibleStopPlace(fsp)
      );
      dispatch(receiveFlexibleStopPlaces(flexibleStopPlaces));
      return Promise.resolve(flexibleStopPlaces);
    })
    .catch(e => {
      dispatch(
        showErrorNotification(
          'Laste stoppesteder',
          'En feil oppstod under lastingen av stoppestedene.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
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
          'En feil oppstod under lastingen av stoppestedet.'
        )
      );
      console.log(e);
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
          'En feil oppstod under lagringen av stoppestedet.'
        )
      );
      console.log(e);
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
          'En feil oppstod under slettingen av stoppestedet.'
        )
      );
      console.log(e);
      return Promise.reject();
    });
};
