import { AnyAction } from 'redux';
import { Centroid, StopPlace } from '../api';
import { RECEIVE_STOP_PLACES } from '../actions/constants';

export type StopPointLocation = [number, number];
export type StopPlacesState = {
  stopPlaces: StopPlace[];
  quayLocationsIndex: Record<string, Centroid>;
  quayStopPlaceIndex: Record<string, string>;
};

const stopPlacesReducer = (
  state: StopPlacesState = null,
  action: AnyAction,
) => {
  switch (action.type) {
    case RECEIVE_STOP_PLACES: {
      const stopPlaces = [...action.stopPlaces];

      const quayLocationsIndex =
        stopPlaces?.length > 0 &&
        stopPlaces.reduce((accumulator, currentStopPlace: StopPlace) => {
          currentStopPlace.quays.forEach((quay) => {
            accumulator[quay.id] = quay.centroid;
          });
          return accumulator;
        }, {});

      const quayStopPlaceIndex =
        stopPlaces?.length > 0 &&
        stopPlaces.reduce((accumulator, currentStopPlace: StopPlace) => {
          currentStopPlace.quays.forEach((quay) => {
            accumulator[quay.id] = currentStopPlace.id;
          });
          return accumulator;
        });

      return {
        stopPlaces,
        quayLocationsIndex,
        quayStopPlaceIndex,
      };
    }
    default:
      return state;
  }
};

export default stopPlacesReducer;
