import { AnyAction } from 'redux';
import { StopPlace } from '../api';
import { RECEIVE_STOP_PLACES } from '../actions/constants';

export type Quay = {
  id: string;
  name: string;
  stopPlaceType: string;
  transportMode: string;
  position: number[];
};

export type StopPlacesState = {
  stopPlaces: StopPlace[];
};

const stopPlacesReducer = (
  state: StopPlacesState = null,
  action: AnyAction,
) => {
  switch (action.type) {
    case RECEIVE_STOP_PLACES: {
      return {
        stopPlaces: [...action.stopPlaces],
      };
    }
    default:
      return state;
  }
};

export default stopPlacesReducer;
