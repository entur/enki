import {
  RECEIVE_FLEXIBLE_STOP_PLACES,
  REQUEST_FLEXIBLE_STOP_PLACES
} from '../actions/flexibleStopPlaces';

const flexibleStopPlaces = (stopPlaces = null, action) => {
  switch (action.type) {
    case REQUEST_FLEXIBLE_STOP_PLACES:
      return null;

    case RECEIVE_FLEXIBLE_STOP_PLACES:
      return action.stopPlaces;

    default:
      return stopPlaces;
  }
};

export default flexibleStopPlaces;
