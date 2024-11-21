import {
  MutableRefObject,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import StopPoint from '../../model/StopPoint';
import {
  FocusedMarker,
  JourneyPatternMarkerType,
  JourneyPatternsMapState,
  JourneyPatternsStopPlacesState,
  MapSpecs,
  StopPointLocation,
} from './types';
import { Centroid, Location, StopPlace, UttuQuery } from '../../api';
import { useAppSelector } from '../../store/hooks';
import { useConfig } from '../../config/ConfigContext';
import { useAuth } from '../../auth/auth';
import { getStopPlacesQuery } from '../../api/uttu/queries';
import { getStopPlacesState } from './helpers';
import { useMap } from 'react-leaflet';

/**
 * Fetching stops data
 */
export const useStopPlacesData = (transportMode: string | undefined) => {
  const activeProvider =
    useAppSelector((state) => state.userContext.activeProviderCode) ?? '';
  const { uttuApiUrl } = useConfig();
  const auth = useAuth();

  const [stopPlacesState, setStopPlacesState] = useReducer<
    Reducer<
      JourneyPatternsStopPlacesState,
      Partial<JourneyPatternsStopPlacesState>
    >
  >(
    (
      state: JourneyPatternsStopPlacesState,
      newState: Partial<JourneyPatternsStopPlacesState>,
    ) => ({
      ...state,
      ...newState,
    }),
    {
      stopPlaces: [],
      quayLocationsIndex: {},
      quayStopPlaceIndex: {},
    },
  );

  useEffect(() => {
    if (transportMode) {
      auth.getAccessToken().then((token) => {
        UttuQuery(
          uttuApiUrl,
          activeProvider,
          getStopPlacesQuery,
          { transportMode },
          token,
        ).then((data) => {
          setStopPlacesState(getStopPlacesState(data?.stopPlaces || []));
        });
      });
    }
  }, []);

  return {
    stopPlacesState,
  };
};

const defaultStopPlaces: StopPlace[] = [];

/**
 * Combines two stop places data sets: one gotten from a normal initial stop places fetch,
 * and the other gotten by using the search input
 * @param stopPlacesState
 * @param searchedStopPlacesState
 */
export const useStopPlacesStateCombinedWithSearchResults = (
  stopPlacesState: JourneyPatternsStopPlacesState,
  searchedStopPlacesState: JourneyPatternsStopPlacesState,
) => {
  const stopPlaces = stopPlacesState?.stopPlaces || defaultStopPlaces;

  // Combining the whole stop places set and the search results:
  const totalStopPlaces = useMemo(() => {
    const total = [...stopPlaces];
    searchedStopPlacesState.stopPlaces?.forEach((stopPlace) => {
      if (stopPlaces.filter((s) => s.id === stopPlace.id).length === 0) {
        total.push(stopPlace);
      }
    });
    return total;
  }, [stopPlaces, searchedStopPlacesState.stopPlaces]);

  const totalQuayLocationsIndex: Record<string, Centroid> = useMemo(() => {
    return {
      ...stopPlacesState?.quayLocationsIndex,
      ...searchedStopPlacesState.quayLocationsIndex,
    };
  }, [
    stopPlacesState?.quayLocationsIndex,
    searchedStopPlacesState.quayLocationsIndex,
  ]);

  const totalQuayStopPlaceIndex: Record<string, string> = useMemo(() => {
    return {
      ...stopPlacesState?.quayStopPlaceIndex,
      ...searchedStopPlacesState.quayStopPlaceIndex,
    };
  }, [
    stopPlacesState?.quayStopPlaceIndex,
    searchedStopPlacesState.quayStopPlaceIndex,
  ]);

  return {
    totalStopPlaces,
    totalQuayLocationsIndex,
    totalQuayStopPlaceIndex,
  };
};

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
    // Locations of the selected quays, to be used in Polyline
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
    mapStateRef.current.hideNonSelectedQuaysState = newHideQuaysState;
    mapStateRef.current.quayStopPointSequenceIndexes =
      newQuayStopPointSequenceIndexes;
    mapStateRef.current.showQuaysState = newShowQuaysState;
    mapStateRef.current.focusedMarker = undefined;
    mapStateRef.current.stopPointLocationSequence = newStopPointLocations;

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

/**
 * Zoom into location. For example, when location a stop/quay from the search or stop point editor
 * @param location
 */
export const useMapZoomIntoLocation = (location: Location | undefined) => {
  const map = useMap();

  useEffect(() => {
    if (location) {
      map.setView([location.latitude, location.longitude], 16);
    }
  }, [location, map]);
};

/**
 * This captures current zoom level and view bounds and updates the state containing those.
 * Used by supercluster to produce clusters and single stops based on the "map specs" (such as zoom or view bounds)
 */
export const useMapSpecs = () => {
  const map = useMap();
  const [mapSpecsState, setMapSpecsState] = useReducer<
    Reducer<MapSpecs, Partial<MapSpecs>>
  >(
    (state: MapSpecs, newState: Partial<MapSpecs>) => ({
      ...state,
      ...newState,
    }),
    {
      zoom: 0,
      bounds: [0, 0, 0, 0],
    },
  );

  const updateMapSpecs = useCallback(() => {
    const newBounds = map.getBounds();

    const newState: MapSpecs = {
      zoom: map.getZoom(),
      bounds: [
        newBounds.getSouthWest().lng,
        newBounds.getSouthWest().lat,
        newBounds.getNorthEast().lng,
        newBounds.getNorthEast().lat,
      ],
    };
    setMapSpecsState(newState);
  }, [map]);

  useEffect(() => {
    updateMapSpecs();
  }, []);

  return {
    mapSpecsState,
    updateMapSpecs,
  };
};

/**
 * When "locate stop point" was clicked from GenericStopPointEditor
 * @param focusedQuayId
 * @param quayLocationsIndex
 * @param quayStopPlaceIndex
 * @param focusMarkerCallback
 */
export const useHandleFocusedQuayId = (
  focusedQuayId: string | undefined | null,
  quayLocationsIndex: Record<string, Centroid>,
  quayStopPlaceIndex: Record<string, string>,
  focusMarkerCallback: (
    focusedMarker: FocusedMarker,
    updateOnlyFocusedMarkerState?: boolean,
  ) => void,
) => {
  useEffect(() => {
    if (focusedQuayId && quayLocationsIndex[focusedQuayId]) {
      const focusedStopPlaceId: string = quayStopPlaceIndex[focusedQuayId];
      // Let's produce a proper focusedMarker out of this
      const newFocusedMarker: FocusedMarker = {
        stopPlaceId: focusedStopPlaceId,
        marker: {
          id: focusedQuayId,
          location: quayLocationsIndex[focusedQuayId].location,
          type: JourneyPatternMarkerType.QUAY,
        },
      };
      focusMarkerCallback(newFocusedMarker, true);
      // Located stop point can be at the end of a long list of stop points, map needs to get into the view if not visible:
      window.scrollTo(0, 520);
    }
  }, [focusedQuayId, quayStopPlaceIndex, quayLocationsIndex]);
};
