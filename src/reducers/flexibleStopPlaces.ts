import {
  RECEIVE_FLEXIBLE_STOP_PLACE,
  RECEIVE_FLEXIBLE_STOP_PLACES,
  REQUEST_FLEXIBLE_STOP_PLACE,
  REQUEST_FLEXIBLE_STOP_PLACES,
  SET_ACTIVE_PROVIDER,
} from 'actions/constants';
import { AnyAction } from 'redux';
import FlexibleStopPlace, {
  mapFlexibleAreasToArea,
} from '../model/FlexibleStopPlace';

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
      return action.stopPlaces.map((sp: FlexibleStopPlace) =>
        mapFlexibleAreasToArea(sp)
      );

    case RECEIVE_FLEXIBLE_STOP_PLACE:
      return (
        stopPlaces
          ? stopPlaces.map((sp) =>
              sp.id === action.stopPlace.id ? action.stopPlace : sp
            )
          : [action.stopPlace]
      ).map((sp) => mapFlexibleAreasToArea(sp));

    case SET_ACTIVE_PROVIDER:
      return null;

    default:
      return stopPlaces;
  }
};

export default flexibleStopPlaces;
