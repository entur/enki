import {
  MutableRefObject,
  Reducer,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { StopPointLocation } from '../../reducers/stopPlaces';
import StopPoint from '../../model/StopPoint';
import { JourneyPatternsMapState } from './types';
import { Centroid } from '../../api';

/**
 * How and what kind of markers are shown on map is determined here
 * @param pointsInSequence quay that user selected into the journey pattern and its order
 * @param quayLocationsIndex a helpful record containing pairs of [quayId -> its location]
 * @param quayStopPlaceIndex a helpful record containing pairs of [quayId -> stopId the quay belongs to]
 */
export const useMapState = (
  pointsInSequence: StopPoint[],
  quayLocationsIndex: Record<string, Centroid> | undefined,
  quayStopPlaceIndex: Record<string, string> | undefined,
) => {
  const [mapState, setMapState] = useReducer<
    Reducer<JourneyPatternsMapState, Partial<JourneyPatternsMapState>>
  >(
    (
      state: JourneyPatternsMapState,
      newState: Partial<JourneyPatternsMapState>,
    ) => ({
      ...state,
      ...newState,
    }),
    {
      quayStopPointSequenceIndexes: {},
      stopPointLocationSequence: [],
      showQuaysState: {},
      hideNonSelectedQuaysState: {},
      focusedMarker: undefined,
    },
  );
  /**
   * This reference is used to avoid infinite loop in the useEffect below;
   * The hideNonSelectedQuaysState part is also set in the callbacks is part of JourneyPatternStopPointMap
   */
  const mapStateRef = useRef<JourneyPatternsMapState>({
    quayStopPointSequenceIndexes: {},
    stopPointLocationSequence: [],
    showQuaysState: {},
    hideNonSelectedQuaysState: {},
    focusedMarker: undefined,
  });

  useEffect(() => {
    let stopPointIndex = 0;
    // Pairs of: quayId => array of numbers at which points the quay comes across the journey pattern,
    // as same quay can be present in the route multiple times
    const newQuayStopPointSequenceIndexes: Record<string, number[]> = {};
    // Determines whether quays are shown or a stop place;
    // when map re-renders, only stop places that have its quay(-s) selected are in the "show quays" mode
    const newShowQuaysState: Record<string, boolean> = {};
    // User can choose to hide quays that aren't selected for the journey pattern;
    // Here mapStateRef keeps track of the current state of hideNonSelectedQuaysState;
    // Using here masState directly instead would result in the infinite loop;
    const newHideQuaysState: Record<string, boolean> = {
      ...mapStateRef.current.hideNonSelectedQuaysState,
    };
    //
    const newStopPointLocations: StopPointLocation[] = [];
    if (!quayStopPlaceIndex || !quayLocationsIndex) {
      return;
    }

    pointsInSequence.forEach((point) => {
      if (!point?.quayRef) {
        stopPointIndex++;
        return;
      }

      const newIndexArray: number[] = newQuayStopPointSequenceIndexes[
        point.quayRef
      ]
        ? [...newQuayStopPointSequenceIndexes[point.quayRef]]
        : [];
      newIndexArray.push(stopPointIndex++);
      newQuayStopPointSequenceIndexes[point.quayRef] = newIndexArray;

      const stopPlaceId = quayStopPlaceIndex[point.quayRef];
      // Let's get into show quays mode, so that a quay entered through the form gets visible:
      newShowQuaysState[stopPlaceId] = true;

      if (quayLocationsIndex[point.quayRef]?.location) {
        newStopPointLocations.push([
          quayLocationsIndex[point.quayRef].location.latitude,
          quayLocationsIndex[point.quayRef].location.longitude,
        ]);
      }
    });

    for (const quayId in mapStateRef.current.quayStopPointSequenceIndexes) {
      // Clean out hideNonSelectedQuaysState if there are no longer any selected quays,
      // if it stays uncleared, user won't see any quays when clicking 'Show quays'
      // as all quays are non-selected at this point
      const stopPlaceId = quayStopPlaceIndex[quayId];
      if (
        !newQuayStopPointSequenceIndexes[quayId] &&
        mapStateRef.current.hideNonSelectedQuaysState[stopPlaceId]
      ) {
        newHideQuaysState[stopPlaceId] = false;
      }
    }

    const newMapState: JourneyPatternsMapState = {
      quayStopPointSequenceIndexes: newQuayStopPointSequenceIndexes,
      stopPointLocationSequence: newStopPointLocations,
      showQuaysState: newShowQuaysState,
      hideNonSelectedQuaysState: newHideQuaysState,
      focusedMarker: undefined,
    };
    mapStateRef.current['hideNonSelectedQuaysState'] = newHideQuaysState;
    mapStateRef.current['quayStopPointSequenceIndexes'] =
      newQuayStopPointSequenceIndexes;
    setMapState(newMapState);
  }, [
    pointsInSequence,
    quayStopPlaceIndex,
    quayLocationsIndex,
    setMapState,
    mapStateRef.current,
  ]);

  return {
    mapState,
    setMapState,
    mapStateRef,
  };
};

/**
 * Reusable hook for opening up focused marker's popup section
 * @param isPopupToBeOpen to open or not
 * @param markerRef ref that would open up the popup
 * @param clearFocusedMarker focusedMarker needs to be cleared away to allow focusing on it repeatedly (aka user clicks same 'locate button' in the search results multiple times)
 */
export const usePopupOpeningOnFocus = (
  isPopupToBeOpen: boolean,
  markerRef: MutableRefObject<any>,
  clearFocusedMarker: () => void,
) => {
  useEffect(() => {
    if (isPopupToBeOpen) {
      if (markerRef && markerRef.current) {
        markerRef.current.openPopup();
        // Mission accomplished, focused marker can be cleared now
        clearFocusedMarker();
      }
    }
  }, [isPopupToBeOpen, markerRef, clearFocusedMarker]);
};
