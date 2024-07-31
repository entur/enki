import './styles.scss';
import FormMap from '../../components/FormMap';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useAppSelector } from '../../store/hooks';
import { Reducer, useCallback, useEffect, useReducer } from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import QuayMarker from './QuayMarker';
import { JourneyPatternStopPointMapProps } from './types';
import { Polyline } from 'react-leaflet';
import { getStopPlaces } from '../../actions/stopPlaces';
import { useDispatch } from 'react-redux';
import { StopPointLocation } from '../../reducers/stopPlaces';

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
    const newQuayIndexRecord = {};
    const newShowQuaysState = {};
    const newStopPointLocations = [];
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

      // Let's get into show quays mode, so that a quay entered through the form get visible:
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
      <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={13}>
        <Polyline positions={mapState.stopPointLocationSequence} />
        {mapState.quayStopPointIndexRecord !== null &&
          stopPlaces?.map((stopPlace) => {
            const selectedQuayIds: string[] = stopPlace.quays
              .filter((quay) => mapState.quayStopPointIndexRecord[quay.id])
              .map((quay) => quay.id);
            return mapState.showQuaysState[stopPlace.id] ? (
              <>
                {stopPlace.quays.map((quay) => {
                  const isSelectedQuay = selectedQuayIds.includes(quay.id);
                  const hasSelectedQuay = !!selectedQuayIds?.length;
                  return !mapState.hideNonSelectedQuaysState[stopPlace.id] ||
                    isSelectedQuay ? (
                    <QuayMarker
                      key={quay.id}
                      quay={quay}
                      stopPointIndex={
                        mapState.quayStopPointIndexRecord[quay.id]
                      }
                      stopPlace={stopPlace}
                      hasSelectedQuay={hasSelectedQuay}
                      hideNonSelectedQuaysState={
                        mapState.hideNonSelectedQuaysState[stopPlace.id]
                      }
                      showQuaysCallback={(showAll) => {
                        showQuaysCallback(showAll, stopPlace.id);
                      }}
                      hideNonSelectedQuaysCallback={(hideNonSelected) => {
                        hideNonSelectedQuaysCallback(
                          hideNonSelected,
                          stopPlace.id,
                        );
                      }}
                      addStopPointCallback={addStopPoint}
                      deleteStopPointCallback={deleteStopPoint}
                    />
                  ) : (
                    ''
                  );
                })}
              </>
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
