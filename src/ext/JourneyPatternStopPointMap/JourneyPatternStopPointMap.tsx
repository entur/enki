import './styles.scss';
import { memo, useCallback, useState } from 'react';
import {
  FocusedMarker,
  FocusedMarkerNewMapState,
  JourneyPatternsStopPlacesState,
  JourneyPatternStopPointMapProps,
} from './types';
import { Polyline, useMapEvents, ZoomControl } from 'react-leaflet';
import { StopPlace } from '../../api';
import SearchPopover from './Popovers/SearchPopover';
import {
  getSelectedQuayIds,
  getStopPlacesState,
  onFocusedMarkerNewMapState,
} from './helpers';
import {
  useHandleFocusedQuayId,
  useMapSpecs,
  useMapState,
  useMapZoomIntoLocation,
  useStopPlacesData,
  useStopPlacesStateCombinedWithSearchResults,
} from './hooks';
import MarkersWrapper from './MarkersWrapper';

const JourneyPatternStopPointMap = memo(
  ({
    pointsInSequence,
    addStopPoint,
    deleteStopPoint,
    transportMode,
    focusedQuayId,
    onFocusedQuayIdUpdate,
  }: JourneyPatternStopPointMapProps) => {
    // Map spaces are zoom level and view bounds
    const { mapSpecsState, updateMapSpecs } = useMapSpecs();
    useMapEvents({
      moveend: () => {
        updateMapSpecs();
      },
    });

    // Fetching stop places data and the indexes:
    const { stopPlacesState } = useStopPlacesData(transportMode);

    // Search results stop places and its respective indexes:
    const [searchedStopPlacesState, setSearchedStopPlacesState] =
      useState<JourneyPatternsStopPlacesState>(getStopPlacesState(undefined));
    const {
      totalStopPlaces,
      totalQuayLocationsIndex,
      totalQuayStopPlaceIndex,
    } = useStopPlacesStateCombinedWithSearchResults(
      stopPlacesState,
      searchedStopPlacesState,
    );

    // This hook manages what's shown on the map and how exactly:
    const { mapState, setMapState, mapStateRef } = useMapState(
      pointsInSequence,
      totalQuayLocationsIndex,
      totalQuayStopPlaceIndex,
    );

    // Zoom into location of a focused marker:
    useMapZoomIntoLocation(mapState.focusedMarker?.marker.location);

    const updateSearchedStopPlacesCallback = useCallback(
      (newSearchedStopPlacesState: JourneyPatternsStopPlacesState) => {
        setSearchedStopPlacesState(newSearchedStopPlacesState);
      },
      [],
    );

    const focusMarkerCallback = useCallback(
      (
        focusedMarker: FocusedMarker | undefined,
        updateOnlyFocusedMarkerState?: boolean,
      ) => {
        if (!focusedMarker) {
          setMapState({ focusedMarker: undefined });
          return;
        }

        if (updateOnlyFocusedMarkerState) {
          setMapState({
            focusedMarker,
          });
          return;
        }

        const oldMapState = {
          ...mapStateRef.current,
        };

        const changedMapState: FocusedMarkerNewMapState =
          onFocusedMarkerNewMapState(
            focusedMarker,
            mapStateRef.current.showQuaysState,
            mapStateRef.current.hideNonSelectedQuaysState,
            mapStateRef.current.quayStopPointSequenceIndexes,
          );

        if (changedMapState.hideNonSelectedQuaysState) {
          // mapStateRef needs to be kept up-to-date to fulfil its purpose in the useMap hook
          mapStateRef.current.hideNonSelectedQuaysState =
            changedMapState.hideNonSelectedQuaysState;
        }
        if (changedMapState.showQuaysState) {
          mapStateRef.current.showQuaysState = changedMapState.showQuaysState;
        }

        setMapState({
          ...oldMapState,
          ...changedMapState,
        });
      },
      [mapStateRef.current],
    );

    // Process the focusedQuayId gotten from outside the stop point editor:
    useHandleFocusedQuayId(
      focusedQuayId,
      totalQuayLocationsIndex,
      totalQuayStopPlaceIndex,
      focusMarkerCallback,
    );

    const clearFocusedMarker = useCallback(() => {
      focusMarkerCallback(undefined);
      if (focusedQuayId) {
        onFocusedQuayIdUpdate(undefined);
      }
    }, [focusedQuayId]);

    const getSelectedQuayIdsCallback = useCallback(
      (stopPlace: StopPlace) => {
        return getSelectedQuayIds(
          stopPlace.quays,
          mapStateRef.current.quayStopPointSequenceIndexes,
        );
      },
      [mapStateRef.current, getSelectedQuayIds],
    );

    const mapStateUpdateCallback = useCallback((newMapState: any) => {
      setMapState(newMapState);
    }, []);

    return (
      <>
        <SearchPopover
          searchedStopPlaces={searchedStopPlacesState.stopPlaces}
          transportMode={transportMode}
          focusMarkerCallback={focusMarkerCallback}
          getSelectedQuayIdsCallback={getSelectedQuayIdsCallback}
          updateSearchedStopPlacesCallback={updateSearchedStopPlacesCallback}
        />
        <ZoomControl position={'topright'} />
        <Polyline positions={mapState.stopPointLocationSequence} />
        <MarkersWrapper
          mapSpecsState={mapSpecsState}
          mapState={mapState}
          mapStateRef={mapStateRef}
          stopPlaces={totalStopPlaces}
          deleteStopPoint={deleteStopPoint}
          addStopPoint={addStopPoint}
          clearFocusedMarker={clearFocusedMarker}
          mapStateUpdateCallback={mapStateUpdateCallback}
        />
      </>
    );
  },
);

export default JourneyPatternStopPointMap;
