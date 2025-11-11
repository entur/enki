import './styles.scss';
import React, { memo, useCallback, useState } from 'react';
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
import Markers from './Markers';
import { useConfig } from '../../config/ConfigContext';
import Loading from '../../components/Loading';
import { useIntl } from 'react-intl';
import { useStopPlacesInJourneyPattern } from './hooks/useStopPlacesInJourneyPattern';
import { useFitMapBounds } from './hooks/useFitMapBounds';
import { useMapSpecs } from './hooks/useMapSpecs';
import { useBoundingBoxedStopPlacesData } from './hooks/useBoundingBoxedStopPlacesData';
import { useStopPlacesStateCombinedWithSearchResults } from './hooks/useStopPlacesStateCombinedWithSearchResults';
import { useMapState } from './hooks/useMapState';
import { useRouteGeometry } from './hooks/useRouteGeometry';
import { useMapZoomIntoLocation } from './hooks/useMapZoomIntoLocation';
import { useHandleFocusedQuayId } from './hooks/useHandleFocusedQuayId';

const JourneyPatternStopPointMap = memo(
  ({
    pointsInSequence,
    addStopPoint,
    deleteStopPoint,
    transportMode,
    focusedQuayId,
    onFocusedQuayIdUpdate,
    stopPlacesInJourneyPattern,
  }: JourneyPatternStopPointMapProps) => {
    const { formatMessage } = useIntl();
    const { routeGeometrySupportedVehicleModes } = useConfig();
    let isRouteGeometryEnabled =
      routeGeometrySupportedVehicleModes &&
      routeGeometrySupportedVehicleModes?.filter(
        (mode) => mode === transportMode,
      ).length > 0;

    const { stopPlacesInJourneyPatternState } = useStopPlacesInJourneyPattern(
      stopPlacesInJourneyPattern,
    );

    // If there are already stop points selected, zoom in to the route on initial map load:
    useFitMapBounds(
      pointsInSequence,
      stopPlacesInJourneyPatternState.quayLocationsIndex,
    );

    // Capture and store map's zoom level and view bounds.
    // Will be used later to produce markers within the visible bounds:
    const { mapSpecsState, updateMapSpecs } = useMapSpecs();
    useMapEvents({
      moveend: () => {
        updateMapSpecs();
      },
    });

    const { stopPlacesState, isStopDataLoading } =
      useBoundingBoxedStopPlacesData(transportMode, mapSpecsState);

    // Search results stop places and its respective indexes:
    const [searchedStopPlacesState, setSearchedStopPlacesState] =
      useState<JourneyPatternsStopPlacesState>(getStopPlacesState(undefined));

    // Get the final stop places data that will be the base for Markers:
    const {
      totalStopPlaces,
      totalQuayLocationsIndex,
      totalQuayStopPlaceIndex,
    } = useStopPlacesStateCombinedWithSearchResults(
      stopPlacesState,
      searchedStopPlacesState,
      stopPlacesInJourneyPatternState,
    );

    // This hook manages what's shown on the map and how exactly:
    const { mapState, setMapState, mapStateRef } = useMapState(
      pointsInSequence,
      stopPlacesInJourneyPatternState.quayLocationsIndex,
      stopPlacesInJourneyPatternState.quayStopPlaceIndex,
      !!isRouteGeometryEnabled,
    );

    if (isRouteGeometryEnabled) {
      // Handling service links data;
      // If route geometry is enabled, this is where the needed coordinates are set up
      useRouteGeometry(
        pointsInSequence,
        totalQuayLocationsIndex,
        setMapState,
        transportMode,
      );
    }

    // Zoom into location of a focused marker:
    useMapZoomIntoLocation(mapState.focusedMarker?.marker.location);

    const updateSearchedStopPlaces = useCallback(
      (newSearchedStopPlacesState: JourneyPatternsStopPlacesState) => {
        setSearchedStopPlacesState(newSearchedStopPlacesState);
      },
      [],
    );

    /**
     * Focused marker may lead to various ways the overall map state would need to be updated:
     */
    const processFocusedMarker = useCallback(
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

    // Process the focusedQuayId gotten from outside, e.g. from the stop point editor:
    useHandleFocusedQuayId(
      focusedQuayId,
      totalQuayLocationsIndex,
      totalQuayStopPlaceIndex,
      processFocusedMarker,
    );

    const clearFocusedMarker = useCallback(() => {
      processFocusedMarker(undefined);
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

    const updateMapState = useCallback((newMapState: any) => {
      setMapState(newMapState);
    }, []);

    return (
      <>
        {!isStopDataLoading ? (
          <>
            <SearchPopover
              searchedStopPlaces={searchedStopPlacesState.stopPlaces}
              transportMode={transportMode}
              getSelectedQuayIds={getSelectedQuayIdsCallback}
              onSearchResultLocated={processFocusedMarker}
              onSearchedStopPlacesFetched={updateSearchedStopPlaces}
            />
            <Polyline positions={mapState.stopPointLocationSequence} />
            <Markers
              mapSpecsState={mapSpecsState}
              mapState={mapState}
              mapStateRef={mapStateRef}
              stopPlaces={totalStopPlaces}
              deleteStopPoint={deleteStopPoint}
              addStopPoint={addStopPoint}
              clearFocusedMarker={clearFocusedMarker}
              onStopPointAddedOrDeleted={updateMapState}
            />
          </>
        ) : (
          <div className="stop-places-spinner">
            <Loading
              isFullScreen={false}
              text={formatMessage({ id: 'mapLoadingStopsDataText' })}
              isLoading={isStopDataLoading}
              children={null}
              className=""
            />
          </div>
        )}
      </>
    );
  },
);

export default JourneyPatternStopPointMap;
