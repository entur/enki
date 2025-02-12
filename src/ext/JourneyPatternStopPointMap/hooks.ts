import {
  MutableRefObject,
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
import StopPoint from '../../model/StopPoint';
import {
  FocusedMarker,
  JourneyPatternMarkerType,
  JourneyPatternsMapState,
  JourneyPatternsStopPlacesState,
  MapSpecs,
  ServiceLink,
  StopPointLocation,
} from './types';
import { Centroid, Location, StopPlace, UttuQuery } from '../../api';
import { useAppSelector } from '../../store/hooks';
import { useConfig } from '../../config/ConfigContext';
import { useAuth } from '../../auth/auth';
import {
  getServiceLinkQuery,
  getStopPlacesQuery,
} from '../../api/uttu/queries';
import {
  getRouteGeometryFetchPromises,
  getServiceLinkRef,
  getStopPlacesState,
  getStopPointLocationSequence,
  getStopPointLocationSequenceWithRouteGeometry,
} from './helpers';
import { useMap } from 'react-leaflet';
import debounce from '../../components/StopPointsEditor/common/debounce';

/**
 * Fetching stops data
 */
export const useStopPlacesData = (
  transportMode: string | undefined,
  mapSpecsState: MapSpecs,
) => {
  const activeProvider =
    useAppSelector((state) => state.userContext.activeProviderCode) ?? '';
  const { uttuApiUrl } = useConfig();
  const auth = useAuth();
  const [isStopDataLoading, setIsStopDataLoading] = useState<boolean>(false);

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
    if (
      transportMode &&
      mapSpecsState &&
      mapSpecsState.zoom &&
      mapSpecsState.bounds[3] &&
      mapSpecsState.bounds[2] &&
      mapSpecsState.bounds[1] &&
      mapSpecsState.bounds[0]
    ) {
      auth.getAccessToken().then((token) => {
        const loadingTimeout = setTimeout(() => {
          setIsStopDataLoading(true);
        }, 1250);

        UttuQuery(
          uttuApiUrl,
          activeProvider,
          getStopPlacesQuery,
          {
            transportMode,
            searchText: undefined,
            northEastLat: mapSpecsState.bounds[3],
            northEastLng: mapSpecsState.bounds[2],
            southWestLat: mapSpecsState.bounds[1],
            southWestLng: mapSpecsState.bounds[0],
          },
          token,
        )
          .then((data) => {
            setStopPlacesState(getStopPlacesState(data?.stopPlaces || []));
          })
          .finally(() => {
            clearTimeout(loadingTimeout);
            setIsStopDataLoading(false);
          });
      });
    }
  }, [
    mapSpecsState.bounds[3],
    mapSpecsState.bounds[2],
    mapSpecsState.bounds[1],
    mapSpecsState.bounds[0],
  ]);

  return {
    stopPlacesState,
    isStopDataLoading,
  };
};

const defaultStopPlaces: StopPlace[] = [];

export const useStopPlacesInLine = (stopPlacesUsedInLineIndex: StopPlace[]) => {
  const [stopPlacesInLineState, setStopPlacesInLineState] =
    useState<JourneyPatternsStopPlacesState>({
      stopPlaces: [],
      quayLocationsIndex: {},
      quayStopPlaceIndex: {},
    });

  useEffect(() => {
    setStopPlacesInLineState(getStopPlacesState(stopPlacesUsedInLineIndex));
  }, [stopPlacesUsedInLineIndex]);

  return {
    stopPlacesInLineState,
  };
};

/**
 * Combines two stop places data sets: one gotten from a normal initial stop places fetch,
 * and the other gotten by using the search input
 * @param stopPlacesState
 * @param searchedStopPlacesState
 * @param stopPlacesUsedInLineIndex
 */
export const useStopPlacesStateCombinedWithSearchResults = (
  stopPlacesState: JourneyPatternsStopPlacesState,
  searchedStopPlacesState: JourneyPatternsStopPlacesState,
  stopPlacesInLineState: JourneyPatternsStopPlacesState,
) => {
  const stopPlaces = stopPlacesState?.stopPlaces || defaultStopPlaces;

  // Combining the whole stop places set and the search results:
  const totalStopPlaces = useMemo(() => {
    const total = [...stopPlaces];
    const stopPlacesToCombine = [
      ...stopPlacesInLineState.stopPlaces,
      ...searchedStopPlacesState.stopPlaces,
    ];
    stopPlacesToCombine.forEach((stopPlace) => {
      if (stopPlaces.filter((s) => s.id === stopPlace.id).length === 0) {
        total.push(stopPlace);
      }
    });

    return total;
  }, [
    stopPlaces,
    searchedStopPlacesState.stopPlaces,
    stopPlacesInLineState.stopPlaces,
  ]);

  const totalQuayLocationsIndex: Record<string, Centroid> = useMemo(() => {
    return {
      ...stopPlacesState?.quayLocationsIndex,
      ...searchedStopPlacesState.quayLocationsIndex,
      ...stopPlacesInLineState.quayLocationsIndex,
    };
  }, [
    stopPlacesState?.quayLocationsIndex,
    searchedStopPlacesState.quayLocationsIndex,
    stopPlacesInLineState.quayLocationsIndex,
  ]);

  const totalQuayStopPlaceIndex: Record<string, string> = useMemo(() => {
    return {
      ...stopPlacesState?.quayStopPlaceIndex,
      ...searchedStopPlacesState.quayStopPlaceIndex,
      ...stopPlacesInLineState.quayStopPlaceIndex,
    };
  }, [
    stopPlacesState?.quayStopPlaceIndex,
    searchedStopPlacesState.quayStopPlaceIndex,
    stopPlacesInLineState.quayStopPlaceIndex,
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
 * @param isRouteGeometryEnabled
 */
export const useMapState = (
  pointsInSequence: StopPoint[],
  quayLocationsIndex: Record<string, Centroid>,
  quayStopPlaceIndex: Record<string, string>,
  isRouteGeometryEnabled: boolean,
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

    pointsInSequence.forEach((point, i) => {
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

      if (
        !isRouteGeometryEnabled &&
        quayLocationsIndex[point.quayRef]?.location
      ) {
        // if route geometry is enabled, the right coordinates sequence will be established as part of useRouteGeometry hook
        const pointLocation = quayLocationsIndex[point.quayRef].location;
        newStopPointLocations.push([
          pointLocation.latitude,
          pointLocation.longitude,
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
    isRouteGeometryEnabled,
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

  const updateMapSpecs = useCallback(
    debounce(
      () => {
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
      },
      500,
      undefined,
    ),
    [map],
  );

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

/**
 * Set map's bounds on initial map load, based on user's existing journey pattern's quays locations.
 * Meant to zoom in far enough that it's easy to see for user how the route spans
 * @param pointsInSequence
 * @param quayLocationsIndex
 */
export const useFitMapBounds = (
  pointsInSequence: StopPoint[],
  quayLocationsIndex: Record<string, Centroid>,
) => {
  // This boundsBeenFit makes sure useEffect will do its thing only once,
  // as quayLocationsIndex can change when search is done
  const boundsBeenFit = useRef(false);
  const map = useMap();

  useEffect(() => {
    if (!boundsBeenFit.current && pointsInSequence?.length < 1) {
      // That's a new line form, boundsBeenFit needs to be set to avoid this hook being triggered when the first stopPoint is added
      boundsBeenFit.current = true;
      return;
    }
    if (
      boundsBeenFit.current ||
      !quayLocationsIndex ||
      Object.keys(quayLocationsIndex).length === 0
    ) {
      // gotta try again once quayLocationsIndex has the contents gathered
      return;
    }

    const stopPointLocationSequence = getStopPointLocationSequence(
      pointsInSequence,
      quayLocationsIndex,
    );
    if (stopPointLocationSequence.length < 1) {
      // Could happen if there is a non-empty pointsInSequence but the quay id-s used in it no longer exist in the backend,
      // hence not found in quayLocationsIndex records
      return;
    }

    let minLat = stopPointLocationSequence[0][0];
    let maxLat = stopPointLocationSequence[0][0];
    let minLng = stopPointLocationSequence[0][1];
    let maxLng = stopPointLocationSequence[0][1];

    stopPointLocationSequence.forEach((location) => {
      if (location[0] < minLat) {
        minLat = location[0];
      } else if (location[0] > maxLat) {
        maxLat = location[0];
      }

      if (location[1] < minLng) {
        minLng = location[1];
      } else if (location[1] > maxLng) {
        maxLng = location[1];
      }
    });

    boundsBeenFit.current = true;
    map.fitBounds([
      [minLat, minLng],
      [maxLat, maxLng],
    ]);
  }, [quayLocationsIndex, boundsBeenFit]);
};

/**
 * Service links contain intermediate locations within a pair of stop points;
 * This allows having a polyline that more realistically follows the shape of the route
 * @param pointsInSequence
 * @param quayLocationsIndex
 * @param setMapState
 */
export const useRouteGeometry = (
  pointsInSequence: StopPoint[],
  quayLocationsIndex: Record<string, Centroid>,
  setMapState: (state: Partial<JourneyPatternsMapState>) => void,
) => {
  const serviceLinksIndex = useRef<Record<string, number[][]>>({});
  const activeProvider =
    useAppSelector((state) => state.userContext.activeProviderCode) ?? '';
  const { uttuApiUrl } = useConfig();
  const auth = useAuth();

  const fetchRouteGeometry = useCallback(
    (quayRefFrom: string, quayRefTo: string) => {
      return auth.getAccessToken().then((token) => {
        return UttuQuery(
          uttuApiUrl,
          activeProvider,
          getServiceLinkQuery,
          { quayRefFrom, quayRefTo },
          token,
        );
      });
    },
    [activeProvider, auth, uttuApiUrl],
  );

  useEffect(() => {
    const fetchRouteGeometryPromises = getRouteGeometryFetchPromises(
      pointsInSequence,
      quayLocationsIndex,
      fetchRouteGeometry,
      serviceLinksIndex.current,
    );
    const newServiceLinkRefs: Record<string, number[][]> = {};

    Promise.all(fetchRouteGeometryPromises).then((serviceLinkResponses) => {
      serviceLinkResponses.forEach((data) => {
        if (!data) {
          return;
        }
        const serviceLink = data?.serviceLink as ServiceLink;
        newServiceLinkRefs[serviceLink.serviceLinkRef] =
          serviceLink.routeGeometry.coordinates;
      });

      serviceLinksIndex.current = {
        ...serviceLinksIndex.current,
        ...newServiceLinkRefs,
      };

      const stopPointLocationSequence =
        getStopPointLocationSequenceWithRouteGeometry(
          pointsInSequence,
          quayLocationsIndex,
          serviceLinksIndex.current,
        );
      setMapState({ stopPointLocationSequence });
    });
  }, [pointsInSequence, serviceLinksIndex, quayLocationsIndex]);
};
