import { MutableRefObject, useCallback, useMemo } from 'react';
import useSupercluster from 'use-supercluster';
import Supercluster, { AnyProps, ClusterProperties } from 'supercluster';
import { StopPlace } from '../../api';
import ClusterMarker from './ClusterMarker';
import Quays from './Quay/Quays';
import StopPlaceMarker from './StopPlaceMarker';
import { JourneyPatternsMapState, MapSpecs } from './types';

interface MarkersProps {
  mapSpecsState: MapSpecs;
  mapState: JourneyPatternsMapState;
  mapStateRef: MutableRefObject<JourneyPatternsMapState>;
  stopPlaces: StopPlace[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  clearFocusedMarker: () => void;
  onStopPointAddedOrDeleted: (newMapState: any) => void;
}

const Markers = ({
  mapSpecsState,
  stopPlaces,
  mapState,
  mapStateRef,
  addStopPoint,
  deleteStopPoint,
  clearFocusedMarker,
  onStopPointAddedOrDeleted,
}: MarkersProps) => {
  // Below goes production of the map markers and clusters:
  const points = useMemo(() => {
    return stopPlaces.map((stopPlace) => ({
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
  }, [stopPlaces]);

  const { clusters } = useSupercluster({
    points: points as Array<
      Supercluster.PointFeature<{ cluster: boolean; stopPlace: StopPlace }>
    >,
    bounds: mapSpecsState.bounds,
    zoom: mapSpecsState.zoom,
    options: {
      radius: mapSpecsState.zoom < 10 ? 150 : mapSpecsState.zoom < 15 ? 105 : 1,
      maxZoom: 25,
      minPoints: 3,
    },
  });

  /**
   * Note that method and deps don't rely on mapState.showQuaysState;
   * Reason for that is, when state changes, so does the showQuays and
   * that can result in the many thousands of stop places markers being re-rendered -
   * - and that we must avoid
   */
  const showQuays = useCallback(
    (showAll: boolean, stopPlaceId: string) => {
      const newShowQuaysState = {
        ...mapStateRef.current.showQuaysState,
      };

      newShowQuaysState[stopPlaceId] = showAll;
      mapStateRef.current.showQuaysState = newShowQuaysState;
      onStopPointAddedOrDeleted({
        showQuaysState: newShowQuaysState,
      });
    },
    [mapStateRef.current],
  );

  const hideNonSelectedQuays = useCallback(
    (hideNonSelected: boolean, stopPlaceId: string) => {
      const newHideNonSelectedQuaysState = {
        ...mapStateRef.current.hideNonSelectedQuaysState,
      };
      newHideNonSelectedQuaysState[stopPlaceId] = hideNonSelected;
      // mapStateRef needs to be kept up-to-date to fulfil its purpose in the useMap hook
      mapStateRef.current['hideNonSelectedQuaysState'] =
        newHideNonSelectedQuaysState;
      onStopPointAddedOrDeleted({
        hideNonSelectedQuaysState: newHideNonSelectedQuaysState,
      });
    },
    [mapStateRef.current],
  );

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
            longitude={longitude}
            latitude={latitude}
            pointCount={pointCount}
            totalPointCount={totalPointCount}
          />
        );
      }

      return mapState.showQuaysState[stopPlace.id] ? (
        <Quays
          key={'quays-wrapper-for-' + stopPlace.id}
          stopPlace={stopPlace}
          stopPointSequenceIndexes={mapState.quayStopPointSequenceIndexes}
          hideNonSelectedQuaysState={
            mapState.hideNonSelectedQuaysState[stopPlace.id]
          }
          deleteStopPoint={deleteStopPoint}
          addStopPoint={addStopPoint}
          hideNonSelectedQuays={hideNonSelectedQuays}
          showQuays={showQuays}
          focusedMarker={mapState.focusedMarker}
          clearFocusedMarker={clearFocusedMarker}
        />
      ) : (
        <StopPlaceMarker
          key={'stop-place-marker-' + stopPlace.id}
          stopPlace={stopPlace}
          showQuays={showQuays}
          addStopPoint={addStopPoint}
          isPopupToBeOpen={stopPlace.id === mapState.focusedMarker?.stopPlaceId}
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

  return <>{markers}</>;
};

export default Markers;
