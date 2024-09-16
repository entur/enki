import { Quay, StopPlace } from '../../api';
import {
  FocusedMarker,
  JourneyPatternMarkerType,
} from './JourneyPatternStopPointMap';

export const getSelectedQuayIds = (
  stopPlace: StopPlace,
  stopPointSequenceIndexes: Record<string, number[]>,
) => {
  const selectedQuays = stopPlace.quays.filter(
    (quay: Quay) => stopPointSequenceIndexes[quay.id]?.length > 0,
  );
  return selectedQuays.map((quay: Quay) => quay.id);
};

export interface FocusedMarkerNewMapState {
  showQuaysState?: Record<string, boolean>;
  hideNonSelectedQuaysState?: Record<string, boolean>;
  focusedMarker: FocusedMarker | undefined;
}

export const onFocusedMarkerNewMapState = (
  focusedMarker: FocusedMarker,
  showQuaysState: Record<string, boolean>,
  hideNonSelectedQuaysState: Record<string, boolean>,
  quayStopPointSequenceIndexes: Record<string, number[]>,
): FocusedMarkerNewMapState => {
  if (
    focusedMarker.marker.type === JourneyPatternMarkerType.QUAY &&
    !showQuaysState[focusedMarker.stopPlace.id]
  ) {
    // User actually searched for a quay, let's get into 'show quays mode' if not already
    const newShowQuaysState = {
      ...showQuaysState,
    };
    newShowQuaysState[focusedMarker.stopPlace.id] = true;
    // Cleaning up any previous hideNonSelectedQuaysState state when showing all
    const newHideNonSelectedQuaysState = {
      ...hideNonSelectedQuaysState,
    };
    newHideNonSelectedQuaysState[focusedMarker.stopPlace.id] = false;
    return { showQuaysState: newShowQuaysState, focusedMarker };
  }

  const selectedQuayIds = getSelectedQuayIds(
    focusedMarker.stopPlace,
    quayStopPointSequenceIndexes,
  );
  if (
    focusedMarker.marker.type === JourneyPatternMarkerType.QUAY &&
    hideNonSelectedQuaysState[focusedMarker.stopPlace.id] &&
    (selectedQuayIds?.length === 0 ||
      !selectedQuayIds.includes(focusedMarker.marker.id))
  ) {
    // If user is in "hide non-selected quays" mode and the focusedMarker happens to be hidden - time to unhide
    const newHideNonSelectedQuaysState = {
      ...hideNonSelectedQuaysState,
    };
    newHideNonSelectedQuaysState[focusedMarker.stopPlace.id] = false;
    return {
      hideNonSelectedQuaysState: newHideNonSelectedQuaysState,
      focusedMarker,
    };
  }

  if (
    focusedMarker.marker.type === JourneyPatternMarkerType.STOP_PLACE &&
    showQuaysState[focusedMarker.stopPlace.id] &&
    selectedQuayIds?.length === 0
  ) {
    // User search for a stop place and currently quays show (yet none selected) - going into stop place icon mode
    const newShowQuaysState = {
      ...showQuaysState,
    };
    newShowQuaysState[focusedMarker.stopPlace.id] = false;
    return { showQuaysState: newShowQuaysState, focusedMarker: focusedMarker };
  }

  return {
    focusedMarker,
  };
};
