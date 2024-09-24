import { AnyAction } from 'redux';
import { Centroid, StopPlace } from '../api';
import {
  RECEIVE_SEARCHED_STOP_PLACES,
  RECEIVE_STOP_PLACES,
} from '../actions/constants';

export type StopPointLocation = [number, number];
export type StopPlacesState = {
  stopPlaces: StopPlace[];
  quayLocationsIndex: Record<string, Centroid>;
  quayStopPlaceIndex: Record<string, string>;
  searchedStopPlaces: StopPlace[];
} | null;

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
        }, {});

      return {
        stopPlaces: state?.searchedStopPlaces
          ? [...stopPlaces, ...state?.searchedStopPlaces]
          : stopPlaces,
        quayLocationsIndex,
        quayStopPlaceIndex,
        searchedStopPlaces: state?.searchedStopPlaces,
      };
    }
    case RECEIVE_SEARCHED_STOP_PLACES: {
      const searchedStopPlaces = [...action.stopPlaces];
      if (!searchedStopPlaces || searchedStopPlaces.length === 0) {
        return {
          ...state,
          searchedStopPlaces: [],
        };
      }

      const searchedQuayLocationsIndex =
        searchedStopPlaces?.length > 0 &&
        searchedStopPlaces.reduce(
          (accumulator, currentStopPlace: StopPlace) => {
            currentStopPlace.quays.forEach((quay) => {
              accumulator[quay.id] = quay.centroid;
            });
            return accumulator;
          },
          {},
        );

      const searchedQuayStopPlaceIndex =
        searchedStopPlaces?.length > 0 &&
        searchedStopPlaces.reduce(
          (accumulator, currentStopPlace: StopPlace) => {
            currentStopPlace.quays.forEach((quay) => {
              accumulator[quay.id] = currentStopPlace.id;
            });
            return accumulator;
          },
          {},
        );

      return {
        stopPlaces: state?.stopPlaces ? [...state?.stopPlaces] : [],
        quayLocationsIndex: {
          ...state?.quayLocationsIndex,
          ...searchedQuayLocationsIndex,
        },
        quayStopPlaceIndex: {
          ...state?.quayStopPlaceIndex,
          ...searchedQuayStopPlaceIndex,
        },
        searchedStopPlaces,
      };
    }
    default:
      return state;
  }
};

export default stopPlacesReducer;
