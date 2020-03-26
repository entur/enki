import {
  RECEIVE_FLEXIBLE_STOP_PLACES,
  REQUEST_FLEXIBLE_STOP_PLACES,
  REQUEST_FLEXIBLE_STOP_PLACE,
  RECEIVE_FLEXIBLE_STOP_PLACE,
} from 'actions/flexibleStopPlaces';
import FlexibleStopPlace from '../model/FlexibleStopPlace';
import { AnyAction } from 'redux';

export type FlexibleStopPlacesState = FlexibleStopPlace[] | null;

const flexibleStopPlaces = (
  stopPlaces: FlexibleStopPlacesState = null,
  action: AnyAction
): FlexibleStopPlacesState => {
  switch (action.type) {
    case REQUEST_FLEXIBLE_STOP_PLACES:
      return null;

    case REQUEST_FLEXIBLE_STOP_PLACE:
      return stopPlaces;

    case RECEIVE_FLEXIBLE_STOP_PLACES:
      return action.stopPlaces;

    case RECEIVE_FLEXIBLE_STOP_PLACE:
      return stopPlaces
        ? stopPlaces.map((sp) =>
            sp.id === action.stopPlace.id ? action.stopPlace : sp
          )
        : [action.stopPlace];

    default:
      return stopPlaces;
  }
};

export default flexibleStopPlaces;
