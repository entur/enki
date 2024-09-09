import './styles.scss';
import FormMap from '../../components/FormMap';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useAppSelector } from '../../store/hooks';
import { Reducer, useCallback, useEffect, useReducer } from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import { JourneyPatternStopPointMapProps } from './types';
import { Polyline, ZoomControl } from 'react-leaflet';
import { getStopPlaces, searchStopPlaces } from '../../actions/stopPlaces';
import { useDispatch } from 'react-redux';
import { StopPlacesState, StopPointLocation } from '../../reducers/stopPlaces';
import { StopPlace } from '../../api';
import QuaysWrapper from './Quay/QuaysWrapper';
import SearchPopover from './Popovers/SearchPopover';

interface MapState {
  quayStopPointSequenceIndexes: Record<string, number[]>;
  stopPointLocationSequence: StopPointLocation[];
  showQuaysState: Record<string, boolean>;
  hideNonSelectedQuaysState: Record<string, boolean>;
  locatedSearchResult: MapSearchResult | undefined;
}

export interface MapSearchResult {
  searchText: string;
  stopPlace: StopPlace;
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
      locatedSearchResult: undefined,
    },
  );

  const stopPlacesState: StopPlacesState = useAppSelector(
    (state) => state.stopPlaces,
  ) as StopPlacesState;
  const stopPlaces = stopPlacesState?.stopPlaces || [];
  const searchedStopPlaces = stopPlacesState?.searchedStopPlaces;
  const totalStopPlaces = stopPlaces ? [...stopPlaces] : [];
  searchedStopPlaces?.forEach((stopPlace) => {
    if (stopPlaces.filter((s) => s.id === stopPlace.id).length === 0) {
      totalStopPlaces.push(stopPlace);
    }
  });

  const quayLocationsIndex = stopPlacesState?.quayLocationsIndex;
  const quayStopPlaceIndex = stopPlacesState?.quayStopPlaceIndex;

  const locateSearchResultCallback = useCallback(
    (searchText: string, stopPlace: StopPlace) => {
      setMapState({ locatedSearchResult: { searchText, stopPlace } });
    },
    [setMapState],
  );

  const clearLocateSearchResult = useCallback(() => {
    setMapState({ locatedSearchResult: undefined });
  }, [setMapState]);

  useEffect(() => {
    if (transportMode) {
      dispatch(getStopPlaces(transportMode));
      // This is for clearing any previous search state:
      dispatch(searchStopPlaces(transportMode, undefined));
    }
  }, []);

  useEffect(() => {
    let stopPointIndex = 0;
    const newQuayIndexesRecord: Record<string, number[]> = {};
    const newShowQuaysState: Record<string, boolean> = {};
    const newStopPointLocations: StopPointLocation[] = [];
    if (!quayStopPlaceIndex || !quayLocationsIndex) {
      return;
    }

    pointsInSequence.forEach((point) => {
      if (!point?.quayRef) {
        stopPointIndex++;
        return;
      }

      const newIndexArray: number[] = newQuayIndexesRecord[point.quayRef]
        ? [...newQuayIndexesRecord[point.quayRef]]
        : [];
      newIndexArray.push(stopPointIndex++);
      newQuayIndexesRecord[point.quayRef] = newIndexArray;

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

    setMapState({
      quayStopPointSequenceIndexes: newQuayIndexesRecord,
      stopPointLocationSequence: newStopPointLocations,
      showQuaysState: newShowQuaysState,
      locatedSearchResult: undefined,
    });
  }, [pointsInSequence, quayStopPlaceIndex, quayLocationsIndex, setMapState]);

  const showQuaysCallback = useCallback(
    (showAll: boolean, stopPlaceId: string) => {
      const newShowQuaysState = {
        ...mapState.showQuaysState,
      };
      newShowQuaysState[stopPlaceId] = showAll;
      setMapState({ showQuaysState: newShowQuaysState });
    },
    [mapState.showQuaysState, setMapState],
  );

  const hideNonSelectedQuaysCallback = useCallback(
    (hideNonSelected: boolean, stopPlaceId: string) => {
      const newHideNonSelectedQuaysState = {
        ...mapState.hideNonSelectedQuaysState,
      };
      newHideNonSelectedQuaysState[stopPlaceId] = hideNonSelected;
      setMapState({ hideNonSelectedQuaysState: newHideNonSelectedQuaysState });
    },
    [mapState.hideNonSelectedQuaysState, setMapState],
  );

  return (
    <FormMap zoomControl={false} doubleClickZoom={false}>
      <>
        <SearchPopover
          transportMode={transportMode}
          locateSearchResultCallback={locateSearchResultCallback}
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
                locatedSearchResult={
                  stopPlace.id === mapState.locatedSearchResult?.stopPlace.id
                    ? mapState.locatedSearchResult
                    : undefined
                }
                clearLocateSearchResult={clearLocateSearchResult}
              />
            ) : (
              <StopPlaceMarker
                key={'stop-place-marker-' + stopPlace.id}
                stopPlace={stopPlace}
                showQuaysCallback={() => {
                  showQuaysCallback(true, stopPlace.id);
                }}
                addStopPointCallback={addStopPoint}
                isPopupToBeOpen={
                  stopPlace.id === mapState.locatedSearchResult?.stopPlace.id
                }
                locatedSearchResult={mapState.locatedSearchResult}
                clearLocateSearchResult={clearLocateSearchResult}
              />
            );
          })}
        </MarkerClusterGroup>
      </>
    </FormMap>
  );
};
