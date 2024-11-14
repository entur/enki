import './styles.scss';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import {
  FocusedMarker,
  FocusedMarkerNewMapState,
  JourneyPatternMarkerType,
  JourneyPatternsStopPlacesState,
  JourneyPatternStopPointMapProps,
} from './types';
import { Polyline, useMapEvents, ZoomControl } from 'react-leaflet';
import { Centroid, StopPlace } from '../../api';
import QuaysWrapper from './Quay/QuaysWrapper';
import SearchPopover from './Popovers/SearchPopover';
import {
  getSelectedQuayIds,
  getStopPlacesState,
  onFocusedMarkerNewMapState,
} from './helpers';
import {
  useMapSpecs,
  useMapState,
  useMapZoomIntoLocation,
  useStopPlacesData,
} from './hooks';
import useSupercluster from 'use-supercluster';
import ClusterMarker from './ClusterMarker';
import Supercluster, { AnyProps, ClusterProperties } from 'supercluster';

const defaultStopPlaces: StopPlace[] = [];

const JourneyPatternStopPointMap = memo(
  ({
    pointsInSequence,
    addStopPoint,
    deleteStopPoint,
    transportMode,
    focusedQuayId,
    updateFocusedQuayIdCallback,
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
    const stopPlaces = stopPlacesState?.stopPlaces || defaultStopPlaces;

    // Search results stop places and its respective indexes:
    const [searchedStopPlacesState, setSearchedStopPlacesState] =
      useState<JourneyPatternsStopPlacesState>(getStopPlacesState(undefined));

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

    // This hook manages what's shown on the map and how exactly:
    const { mapState, setMapState, mapStateRef } = useMapState(
      pointsInSequence,
      totalQuayLocationsIndex,
      totalQuayStopPlaceIndex,
    );
    useMapZoomIntoLocation(mapState.focusedMarker?.marker.location);

    // When "locate stop point" was clicked from GenericStopPointEditor:
    useEffect(() => {
      if (focusedQuayId && totalQuayLocationsIndex[focusedQuayId]) {
        const focusedStopPlaceId: string =
          totalQuayStopPlaceIndex[focusedQuayId];
        // Let's produce a proper focusedMarker out of this
        const newFocusedMarker: FocusedMarker = {
          stopPlaceId: focusedStopPlaceId,
          marker: {
            id: focusedQuayId,
            location: totalQuayLocationsIndex[focusedQuayId].location,
            type: JourneyPatternMarkerType.QUAY,
          },
        };
        setMapState({
          focusedMarker: newFocusedMarker,
        });
      }
    }, [focusedQuayId, totalQuayStopPlaceIndex, totalQuayLocationsIndex]);

    // Below proceeds a bunch of callbacks that are passed further down the component tree to trigger map's state updates from those:
    const updateSearchedStopPlacesCallback = useCallback(
      (newSearchedStopPlacesState: JourneyPatternsStopPlacesState) => {
        setSearchedStopPlacesState(newSearchedStopPlacesState);
      },
      [],
    );

    const focusMarkerCallback = useCallback(
      (focusedMarker: FocusedMarker | undefined) => {
        if (!focusedMarker) {
          setMapState({ focusedMarker: undefined });
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

    const clearFocusedMarker = useCallback(() => {
      focusMarkerCallback(undefined);
      if (focusedQuayId) {
        updateFocusedQuayIdCallback(undefined);
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

    /**
     * Note that method and deps don't rely on mapState.showQuaysState;
     * Reason for that is, when state changes, so does the showQuaysCallback and
     * that can result in the many thousands of stop places markers being re-rendered -
     * - and that we must avoid
     */
    const showQuaysCallback = useCallback(
      (showAll: boolean, stopPlaceId: string) => {
        const newShowQuaysState = {
          ...mapStateRef.current.showQuaysState,
        };

        newShowQuaysState[stopPlaceId] = showAll;
        mapStateRef.current.showQuaysState = newShowQuaysState;
        setMapState({
          showQuaysState: newShowQuaysState,
          //hideNonSelectedQuaysState: newHideNonSelectedQuaysState,
        });
      },
      [mapStateRef.current],
    );

    const hideNonSelectedQuaysCallback = useCallback(
      (hideNonSelected: boolean, stopPlaceId: string) => {
        const newHideNonSelectedQuaysState = {
          ...mapStateRef.current.hideNonSelectedQuaysState,
        };
        newHideNonSelectedQuaysState[stopPlaceId] = hideNonSelected;
        // mapStateRef needs to be kept up-to-date to fulfil its purpose in the useMap hook
        mapStateRef.current['hideNonSelectedQuaysState'] =
          newHideNonSelectedQuaysState;
        setMapState({
          hideNonSelectedQuaysState: newHideNonSelectedQuaysState,
        });
      },
      [mapStateRef.current],
    );

    // Below goes production of the map markers and clusters:
    const points = useMemo(() => {
      return totalStopPlaces.map((stopPlace) => ({
        type: 'Feature',
        properties: { cluster: false, stopPlace },
        geometry: {
          type: 'Point',
          coordinates: [
            stopPlace.quays[0].centroid.location.longitude,
            stopPlace.quays[0].centroid.location.latitude,
          ],
        },
      }));
    }, [totalStopPlaces]);

    const { clusters } = useSupercluster({
      points: points as Array<
        Supercluster.PointFeature<{ cluster: boolean; stopPlace: StopPlace }>
      >,
      bounds: mapSpecsState.bounds,
      zoom: mapSpecsState.zoom,
      options: {
        radius:
          mapSpecsState.zoom < 10 ? 150 : mapSpecsState.zoom < 15 ? 125 : 1,
        maxZoom: 22,
      },
    });

    const markers = useMemo(() => {
      const totalPointCount = points.length;
      return clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        // the point may be either a cluster or a single stop point
        const { cluster: isCluster, point_count: pointCount } =
          cluster.properties as ClusterProperties;
        const stopPlace = (cluster.properties as AnyProps).stopPlace;

        if (isCluster) {
          return (
            <ClusterMarker
              key={'cluster-' + cluster.id}
              clusterId={cluster.id}
              longitude={longitude}
              latitude={latitude}
              pointCount={pointCount}
              totalPointCount={totalPointCount}
            />
          );
        }

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
            clearFocusedMarker={clearFocusedMarker}
          />
        ) : (
          <StopPlaceMarker
            key={'stop-place-marker-' + stopPlace.id}
            stopPlace={stopPlace}
            showQuaysCallback={showQuaysCallback}
            addStopPointCallback={addStopPoint}
            isPopupToBeOpen={
              stopPlace.id === mapState.focusedMarker?.stopPlaceId
            }
            clearFocusedMarker={clearFocusedMarker}
          />
        );
      });
    }, [
      clusters,
      mapState.showQuaysState,
      mapState.focusedMarker,
      mapState.hideNonSelectedQuaysState,
      mapState.quayStopPointSequenceIndexes,
    ]);

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
        {markers}
      </>
    );
  },
);

export default JourneyPatternStopPointMap;
