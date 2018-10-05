import { CREATE_FLEXIBLE_STOP_PLACE } from '../actions/flexibleStopPlaces';

const flexibleStopPlaces = (stopPlaces = [], action) => {
  switch (action.type) {
    case CREATE_FLEXIBLE_STOP_PLACE:
      return stopPlaces.concat(action.fsp);

    default:
      return stopPlaces;
  }
};

export default flexibleStopPlaces;
