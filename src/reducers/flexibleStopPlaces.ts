import {
  RECEIVE_FLEXIBLE_STOP_PLACE,
  RECEIVE_FLEXIBLE_STOP_PLACES,
  REQUEST_FLEXIBLE_STOP_PLACE,
  REQUEST_FLEXIBLE_STOP_PLACES,
} from 'actions/constants';
import {
  ReceiveFlexibleStopPlaceAction,
  ReceiveFlexibleStopPlacesAction,
} from 'actions/flexibleStopPlaces';
import { UnknownAction } from 'redux';
import FlexibleStopPlace, {
  mapFlexibleAreasToArea,
} from '../model/FlexibleStopPlace';

export type FlexibleStopPlacesState = FlexibleStopPlace[] | null;

const flexibleStopPlaces = (
  stopPlaces: FlexibleStopPlacesState = null,
  action: UnknownAction,
): FlexibleStopPlacesState => {
  switch (action.type) {
    case REQUEST_FLEXIBLE_STOP_PLACES:
      return null;

    case REQUEST_FLEXIBLE_STOP_PLACE:
      return stopPlaces;

    case RECEIVE_FLEXIBLE_STOP_PLACES:
      return (action as ReceiveFlexibleStopPlacesAction).stopPlaces.map(
        (sp: FlexibleStopPlace) => mapFlexibleAreasToArea(sp),
      );

    case RECEIVE_FLEXIBLE_STOP_PLACE: {
      const typedAction = action as ReceiveFlexibleStopPlaceAction;
      return (
        stopPlaces
          ? stopPlaces.map((sp) =>
              sp.id === typedAction.stopPlace.id ? typedAction.stopPlace : sp,
            )
          : [typedAction.stopPlace]
      ).map((sp) => mapFlexibleAreasToArea(sp));
    }

    default:
      return stopPlaces;
  }
};

export default flexibleStopPlaces;
