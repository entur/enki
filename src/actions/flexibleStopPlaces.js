import { getFlexibleStopPlacesQuery } from '../graphql/uttu/queries';
import { UttuQuery } from '../graphql';
import { FlexibleStopPlace } from '../model';
import { showErrorNotification } from '../components/Notification/actions';

export const REQUEST_FLEXIBLE_STOP_PLACES = 'REQUEST_FLEXIBLE_STOP_PLACES';
export const RECEIVE_FLEXIBLE_STOP_PLACES = 'RECEIVE_FLEXIBLE_STOP_PLACES';

const requestFlexibleStopPlaces = () => ({
  type: REQUEST_FLEXIBLE_STOP_PLACES
});

const receiveFlexibleStopPlaces = stopPlaces => ({
  type: RECEIVE_FLEXIBLE_STOP_PLACES,
  stopPlaces
});

export const CREATE_FLEXIBLE_STOP_PLACE = 'CREATE_FLEXIBLE_STOP_PLACE';

export const createFlexibleStopPlace = fsp => ({
  type: CREATE_FLEXIBLE_STOP_PLACE,
  fsp
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
    .catch(() => {
      dispatch(
        showErrorNotification(
          'Hente stoppesteder',
          'En feil oppstod under hentingen av stoppestedene.'
        )
      );
      return Promise.reject();
    });
};
