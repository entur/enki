import './styles.scss';
import FormMap from '../../components/FormMap';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useAppSelector } from '../../store/hooks';
import { Reducer, useCallback, useEffect, useReducer } from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import { JourneyPatternStopPointMapProps } from './types';
import { Polyline } from 'react-leaflet';
import { getStopPlaces } from '../../actions/stopPlaces';
import { useDispatch } from 'react-redux';
import { StopPointLocation } from '../../reducers/stopPlaces';
import { StopPlace } from '../../api';
import QuaysWrapper from './QuaysWrapper';

interface MapState {
  quayStopPointIndexRecord: Record<string, number>;
  stopPointLocationSequence: StopPointLocation[];
  showQuaysState: Record<string, boolean>;
  hideNonSelectedQuaysState: Record<string, boolean>;
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
      quayStopPointIndexRecord: {},
      stopPointLocationSequence: [],
      showQuaysState: {},
      hideNonSelectedQuaysState: {},
    },
  );

  const stopPlaces = useAppSelector((state) => state.stopPlaces)?.stopPlaces;
  const quayLocationsIndex = useAppSelector(
    (state) => state.stopPlaces,
  )?.quayLocationsIndex;
  const quayStopPlaceIndex = useAppSelector(
    (state) => state.stopPlaces,
  )?.quayStopPlaceIndex;

  useEffect(() => {
    if (transportMode) {
      dispatch(getStopPlaces(transportMode));
    }
  }, []);

  useEffect(() => {
    let stopPointIndex = 0;
    const newQuayIndexRecord: Record<string, number> = {};
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
      newQuayIndexRecord[point.quayRef] = stopPointIndex++;
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
      quayStopPointIndexRecord: newQuayIndexRecord,
      stopPointLocationSequence: newStopPointLocations,
      showQuaysState: newShowQuaysState,
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
    <FormMap>
      <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={12}>
        <Polyline positions={mapState.stopPointLocationSequence} />
        {stopPlaces?.map((stopPlace: StopPlace) => {
          return mapState.showQuaysState[stopPlace.id] ? (
            <QuaysWrapper
              stopPlace={stopPlace}
              quayStopPointIndexRecord={mapState.quayStopPointIndexRecord}
              hideNonSelectedQuaysState={
                mapState.hideNonSelectedQuaysState[stopPlace.id]
              }
              deleteStopPoint={deleteStopPoint}
              addStopPoint={addStopPoint}
              hideNonSelectedQuaysCallback={hideNonSelectedQuaysCallback}
              showQuaysCallback={showQuaysCallback}
            />
          ) : (
            <StopPlaceMarker
              key={stopPlace.id}
              stopPlace={stopPlace}
              showQuaysCallback={() => {
                showQuaysCallback(true, stopPlace.id);
              }}
              addStopPointCallback={addStopPoint}
            />
          );
        })}
      </MarkerClusterGroup>
    </FormMap>
  );
};
