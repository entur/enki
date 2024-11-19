import { MutableRefObject, useCallback, useMemo } from 'react';
import useSupercluster from 'use-supercluster';
import Supercluster, { AnyProps, ClusterProperties } from 'supercluster';
import { StopPlace } from '../../api';
import ClusterMarker from './ClusterMarker';
import QuaysWrapper from './Quay/QuaysWrapper';
import StopPlaceMarker from './StopPlaceMarker';
import { JourneyPatternsMapState, MapSpecs } from './types';

interface MarkersWrapper {
  mapSpecsState: MapSpecs;
  mapState: JourneyPatternsMapState;
  mapStateRef: MutableRefObject<JourneyPatternsMapState>;
  stopPlaces: StopPlace[];
  deleteStopPoint: (index: number) => void;
  addStopPoint: (quayRef?: string) => void;
  clearFocusedMarker: () => void;
  mapStateUpdateCallback: (newMapState: any) => void;
}

const MarkersWrapper = ({
  mapSpecsState,
  stopPlaces,
  mapState,
  mapStateRef,
  addStopPoint,
  deleteStopPoint,
  clearFocusedMarker,
  mapStateUpdateCallback,
}: MarkersWrapper) => {
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
      radius: mapSpecsState.zoom < 10 ? 150 : mapSpecsState.zoom < 15 ? 125 : 1,
      maxZoom: 22,
    },
  });

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
      mapStateUpdateCallback({
        showQuaysState: newShowQuaysState,
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
      mapStateUpdateCallback({
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

export default MarkersWrapper;
