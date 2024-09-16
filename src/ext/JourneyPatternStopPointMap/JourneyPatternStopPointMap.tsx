import './styles.scss';
import FormMap from '../../components/FormMap';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useAppSelector } from '../../store/hooks';
import {
  Reducer,
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import { JourneyPatternStopPointMapProps } from './types';
import { Polyline, ZoomControl } from 'react-leaflet';
import { getStopPlaces, searchStopPlaces } from '../../actions/stopPlaces';
import { useDispatch } from 'react-redux';
import { StopPlacesState, StopPointLocation } from '../../reducers/stopPlaces';
import { StopPlace } from '../../api';
import QuaysWrapper from './Quay/QuaysWrapper';
import SearchPopover from './Popovers/SearchPopover';
import {
  FocusedMarkerNewMapState,
  getSelectedQuayIds,
  onFocusedMarkerNewMapState,
} from './helpers';

interface MapState {
  quayStopPointSequenceIndexes: Record<string, number[]>;
  stopPointLocationSequence: StopPointLocation[];
  showQuaysState: Record<string, boolean>;
  hideNonSelectedQuaysState: Record<string, boolean>;
  focusedMarker: FocusedMarker | undefined;
}

/**
 * Determines whether to "focus" a stop place or a quay
 */
export enum JourneyPatternMarkerType {
  QUAY = 'quay',
  STOP_PLACE = 'stop_place',
}

export interface JourneyPatternMarker {
  id: string;
  type: JourneyPatternMarkerType;
}

/**
 * E.g. when user clicks on "locate" button in the search input results,
 * a certain marker gets into a "focused" state - meaning e.g. its popup opens up
 */
export interface FocusedMarker {
  stopPlace: StopPlace;
  marker: JourneyPatternMarker;
}

export const JourneyPatternStopPointMap = ({
  pointsInSequence,
  addStopPoint,
  deleteStopPoint,
  transportMode,
}: JourneyPatternStopPointMapProps) => {
  const dispatch = useDispatch<any>();
  const [mapState, setMapState] = useReducer<
    Reducer<MapState, Partial<MapState>>
  >(
    (state: MapState, newState: Partial<MapState>) => ({
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
  const mapStateRef = useRef<MapState>({
    quayStopPointSequenceIndexes: {},
    stopPointLocationSequence: [],
    showQuaysState: {},
    hideNonSelectedQuaysState: {},
    focusedMarker: undefined,
  });

  const stopPlacesState: StopPlacesState = useAppSelector(
    (state) => state.stopPlaces,
  ) as StopPlacesState;
  const stopPlaces = stopPlacesState?.stopPlaces || [];
  const searchedStopPlaces = stopPlacesState?.searchedStopPlaces;
  const totalStopPlaces = useMemo(() => {
    const total = stopPlaces ? [...stopPlaces] : [];
    searchedStopPlaces?.forEach((stopPlace) => {
      if (stopPlaces.filter((s) => s.id === stopPlace.id).length === 0) {
        total.push(stopPlace);
      }
    });
    return total;
  }, [stopPlaces, searchedStopPlaces]);

  const quayLocationsIndex = stopPlacesState?.quayLocationsIndex;
  const quayStopPlaceIndex = stopPlacesState?.quayStopPlaceIndex;

  const focusMarkerCallback = useCallback(
    (focusedMarker: FocusedMarker | undefined) => {
      if (!focusedMarker) {
        setMapState({ focusedMarker: undefined });
        return;
      }

      const changedMapState: FocusedMarkerNewMapState =
        onFocusedMarkerNewMapState(
          focusedMarker,
          mapState.showQuaysState,
          mapState.hideNonSelectedQuaysState,
          mapState.quayStopPointSequenceIndexes,
        );

      if (changedMapState.hideNonSelectedQuaysState) {
        mapStateRef.current['hideNonSelectedQuaysState'] =
          changedMapState.hideNonSelectedQuaysState;
      }

      setMapState({
        ...mapState,
        ...changedMapState,
      });
    },
    [setMapState, mapState, mapStateRef.current],
  );

  const getSelectedQuayIdsCallback = useCallback(
    (stopPlace: StopPlace) => {
      return getSelectedQuayIds(
        stopPlace,
        mapState.quayStopPointSequenceIndexes,
      );
    },
    [mapState.quayStopPointSequenceIndexes, getSelectedQuayIds],
  );

  useEffect(() => {
    if (transportMode) {
      dispatch(getStopPlaces(transportMode));
      // This is for clearing any previous search state:
      dispatch(searchStopPlaces(transportMode, undefined));
    }
  }, []);

  useEffect(() => {
    let stopPointIndex = 0;
    const newQuayStopPointSequenceIndexes: Record<string, number[]> = {};
    const newShowQuaysState: Record<string, boolean> = {};
    const newHideQuaysState: Record<string, boolean> = {
      ...mapStateRef.current.hideNonSelectedQuaysState,
    };
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
      // Clean out hideNonSelectedQuaysState if there are no longer any selected quays
      const stopPlaceId = quayStopPlaceIndex[quayId];
      if (
        !newQuayStopPointSequenceIndexes[quayId] &&
        mapStateRef.current.hideNonSelectedQuaysState[stopPlaceId]
      ) {
        newHideQuaysState[stopPlaceId] = false;
      }
    }

    const newMapState: MapState = {
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

  const showQuaysCallback = useCallback(
    (showAll: boolean, stopPlaceId: string) => {
      const newShowQuaysState = {
        ...mapState.showQuaysState,
      };
      newShowQuaysState[stopPlaceId] = showAll;
      // Cleaning up any previous hideNonSelectedQuaysState state when showing all
      const newHideNonSelectedQuaysState = {
        ...mapState.hideNonSelectedQuaysState,
      };
      newHideNonSelectedQuaysState[stopPlaceId] = showAll
        ? false
        : mapState.hideNonSelectedQuaysState[stopPlaceId];
      mapStateRef.current['hideNonSelectedQuaysState'] =
        newHideNonSelectedQuaysState;
      setMapState({
        showQuaysState: newShowQuaysState,
        hideNonSelectedQuaysState: newHideNonSelectedQuaysState,
      });
    },
    [mapState.showQuaysState, setMapState, mapStateRef.current],
  );

  const hideNonSelectedQuaysCallback = useCallback(
    (hideNonSelected: boolean, stopPlaceId: string) => {
      const newHideNonSelectedQuaysState = {
        ...mapState.hideNonSelectedQuaysState,
      };
      newHideNonSelectedQuaysState[stopPlaceId] = hideNonSelected;
      mapStateRef.current['hideNonSelectedQuaysState'] =
        newHideNonSelectedQuaysState;
      setMapState({ hideNonSelectedQuaysState: newHideNonSelectedQuaysState });
    },
    [mapState.hideNonSelectedQuaysState, setMapState, mapStateRef.current],
  );

  return (
    <FormMap zoomControl={false} doubleClickZoom={false}>
      <>
        <SearchPopover
          transportMode={transportMode}
          focusMarkerCallback={focusMarkerCallback}
          getSelectedQuayIdsCallback={getSelectedQuayIdsCallback}
        />
        <ZoomControl position={'topright'} />
        <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={12}>
          <Polyline positions={mapState.stopPointLocationSequence} />
          {totalStopPlaces.map((stopPlace: StopPlace) => {
            return mapState.showQuaysState[stopPlace.id] ? (
              <QuaysWrapper
                key={'quays-wrapper-for-' + stopPlace.id}
                stopPlace={stopPlace}
                stopPointSequenceIndexes={mapState.quayStopPointSequenceIndexes}
                hideNonSelectedQuaysState={
                  mapState.hideNonSelectedQuaysState[stopPlace.id]
                }
                deleteStopPoint={deleteStopPoint}
                addStopPoint={addStopPoint}
                hideNonSelectedQuaysCallback={hideNonSelectedQuaysCallback}
                showQuaysCallback={showQuaysCallback}
                focusedMarker={mapState.focusedMarker}
                focusMarkerCallback={focusMarkerCallback}
              />
            ) : (
              <StopPlaceMarker
                key={'stop-place-marker-' + stopPlace.id}
                stopPlace={stopPlace}
                showQuaysCallback={() => {
                  showQuaysCallback(true, stopPlace.id);
                }}
                addStopPointCallback={addStopPoint}
                focusedMarker={mapState.focusedMarker}
                focusMarkerCallback={focusMarkerCallback}
              />
            );
          })}
        </MarkerClusterGroup>
      </>
    </FormMap>
  );
};
