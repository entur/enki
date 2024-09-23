import './styles.scss';
import FormMap from '../../components/FormMap';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useAppSelector } from '../../store/hooks';
import { useCallback, useEffect, useMemo } from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import {
  JourneyPatternStopPointMapProps,
  FocusedMarker,
  FocusedMarkerNewMapState,
} from './types';
import { Polyline, ZoomControl } from 'react-leaflet';
import {
  clearStopPlacesSearchResults,
  getStopPlaces,
} from '../../actions/stopPlaces';
import { useDispatch } from 'react-redux';
import { StopPlacesState } from '../../reducers/stopPlaces';
import { StopPlace } from '../../api';
import QuaysWrapper from './Quay/QuaysWrapper';
import SearchPopover from './Popovers/SearchPopover';
import { getSelectedQuayIds, onFocusedMarkerNewMapState } from './helpers';
import { useMapState } from './hooks';

export const JourneyPatternStopPointMap = ({
  pointsInSequence,
  addStopPoint,
  deleteStopPoint,
  transportMode,
}: JourneyPatternStopPointMapProps) => {
  const dispatch = useDispatch<any>();
  const stopPlacesState: StopPlacesState = useAppSelector(
    (state) => state.stopPlaces,
  ) as StopPlacesState;
  const stopPlaces = stopPlacesState?.stopPlaces || [];
  const searchedStopPlaces = stopPlacesState?.searchedStopPlaces;
  const totalStopPlaces = useMemo(() => {
    const total = [...stopPlaces];
    searchedStopPlaces?.forEach((stopPlace) => {
      if (stopPlaces.filter((s) => s.id === stopPlace.id).length === 0) {
        total.push(stopPlace);
      }
    });
    return total;
  }, [stopPlaces, searchedStopPlaces]);
  const quayLocationsIndex = stopPlacesState?.quayLocationsIndex;
  const quayStopPlaceIndex = stopPlacesState?.quayStopPlaceIndex;
  // This hook manages what's shown on the map and how exactly:
  const { mapState, setMapState, mapStateRef } = useMapState(
    pointsInSequence,
    quayLocationsIndex,
    quayStopPlaceIndex,
  );

  useEffect(() => {
    if (transportMode) {
      dispatch(getStopPlaces(transportMode));
      // This is for clearing any previous search state:
      dispatch(clearStopPlacesSearchResults());
    }
  }, []);

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
        // mapStateRef needs to be kept up-to-date to fulfil its purpose in the useMap hook
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

  const showQuaysCallback = useCallback(
    (showAll: boolean, stopPlaceId: string) => {
      const newShowQuaysState = {
        ...mapState.showQuaysState,
      };
      newShowQuaysState[stopPlaceId] = showAll;
      setMapState({
        showQuaysState: newShowQuaysState,
        //hideNonSelectedQuaysState: newHideNonSelectedQuaysState,
      });
    },
    [mapState.showQuaysState, setMapState],
  );

  const hideNonSelectedQuaysCallback = useCallback(
    (hideNonSelected: boolean, stopPlaceId: string) => {
      const newHideNonSelectedQuaysState = {
        ...mapState.hideNonSelectedQuaysState,
      };
      newHideNonSelectedQuaysState[stopPlaceId] = hideNonSelected;
      // mapStateRef needs to be kept up-to-date to fulfil its purpose in the useMap hook
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
                clearFocusedMarker={() => focusMarkerCallback(undefined)}
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
                clearFocusedMarker={() => focusMarkerCallback(undefined)}
              />
            );
          })}
        </MarkerClusterGroup>
      </>
    </FormMap>
  );
};
