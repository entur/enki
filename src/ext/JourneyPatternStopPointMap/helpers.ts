import { Quay, StopPlace } from '../../api';
import {
  FocusedMarker,
  FocusedMarkerNewMapState,
  JourneyPatternMarker,
  JourneyPatternMarkerType,
} from './types';

/**
 * Returns an array of quay id-s in a stop place that are selected to be part of a journey pattern
 * @param stopPlace
 * @param stopPointSequenceIndexes contains all the quay id keys that are part of the journey pattern
 */
export const getSelectedQuayIds = (
  stopPlace: StopPlace,
  stopPointSequenceIndexes: Record<string, number[]>,
) => {
  const selectedQuays = stopPlace.quays.filter(
    (quay: Quay) => stopPointSequenceIndexes[quay.id]?.length > 0,
  );
  return selectedQuays.map((quay: Quay) => quay.id);
};

/**
 * On occasion of a focused marker (e.g. when clicking 'locate button' in search results),
 * map needs to change its state to be able to actually show the marker (and the open popup).
 * More about the possible situations in the method's comments.
 * Method returns a part of the map state that needs to change, which afterwards gets merged with whole map state.
 * @param focusedMarker
 * @param showQuaysState
 * @param hideNonSelectedQuaysState
 * @param quayStopPointSequenceIndexes
 */
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

/**
 * Sort stop places by name
 * @param a
 * @param b
 */
export const sortStopPlaces = (a: StopPlace, b: StopPlace) => {
  if (a.name.value < b.name.value) {
    return -1;
  }
  if (a.name.value > b.name.value) {
    return 1;
  }
  return 0;
};

/**
 * Based on search text, determining which one of the stop places' quays to make focused (aka marker's popup shown)
 * @param searchText
 * @param stopPlace
 * @param selectedQuayIds
 */
export const determineQuayToFocus = (
  searchText: string,
  stopPlace: StopPlace,
  selectedQuayIds: string[],
): JourneyPatternMarker => {
  const quayFullyMatchingSearch = stopPlace.quays.filter(
    (q) => q.id === searchText,
  )[0];
  if (quayFullyMatchingSearch) {
    return {
      id: quayFullyMatchingSearch.id,
      type: JourneyPatternMarkerType.QUAY,
    };
  }

  const quayContainingSearch = stopPlace.quays.filter((q) =>
    q.id.includes(searchText),
  )[0];
  if (quayContainingSearch) {
    return { id: quayContainingSearch.id, type: JourneyPatternMarkerType.QUAY };
  }

  const firstSelectedQuayId =
    selectedQuayIds.length > 0 ? selectedQuayIds[0] : undefined;
  if (firstSelectedQuayId) {
    return { id: firstSelectedQuayId, type: JourneyPatternMarkerType.QUAY };
  }

  const justTheFirstQuay = stopPlace.quays[0];
  return { id: justTheFirstQuay.id, type: JourneyPatternMarkerType.QUAY };
};
