import './styles.scss';
import FormMap from '../../components/FormMap';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useQuays } from '../../components/StopPointsEditor/Generic/QuaysContext';
import { useAppSelector } from '../../store/hooks';
import { useCallback, useState } from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import QuayMarker from './QuayMarker';

export const JourneyPatternStopPointMap = () => {
  const { quaySelectionStates } = useQuays();
  const stopPlaces = useAppSelector((state) => state.stopPlaces);
  const [showQuaysState, setShowQuaysState] = useState({});
  const [hideNonSelectedQuaysState, setHideNonSelectedQuaysState] = useState(
    {},
  );

  const showQuaysCallback = useCallback(
    (showAll: boolean, stopPlaceId: string) => {
      const newShowQuaysState = {
        ...showQuaysState,
      };
      newShowQuaysState[stopPlaceId] = showAll;
      setShowQuaysState(newShowQuaysState);
    },
    [setShowQuaysState],
  );

  const hideNonSelectedQuaysCallback = useCallback(
    (hideNonSelected: boolean, stopPlaceId: string) => {
      const newHideNonSelectedQuaysState = {
        ...hideNonSelectedQuaysState,
      };
      newHideNonSelectedQuaysState[stopPlaceId] = hideNonSelected;
      setHideNonSelectedQuaysState(newHideNonSelectedQuaysState);
    },
    [setHideNonSelectedQuaysState],
  );

  return (
    <FormMap>
      <MarkerClusterGroup chunkedLoading disableClusteringAtZoom={13}>
        {stopPlaces?.stopPlaces?.map((stopPlace) => {
          const selectedQuayArr = stopPlace.quays.filter(
            (quay) => quaySelectionStates[quay.id],
          );
          const selectedQuay =
            selectedQuayArr.length > 0 ? selectedQuayArr[0] : undefined;
          return showQuaysState[stopPlace.id] ? (
            <>
              {stopPlace.quays.map((quay) =>
                !hideNonSelectedQuaysState[stopPlace.id] ||
                (selectedQuay && quay.id === selectedQuay.id) ? (
                  <QuayMarker
                    key={quay.id}
                    selectedQuay={selectedQuay}
                    quay={quay}
                    stopPlace={stopPlace}
                    hideNonSelectedQuaysState={
                      hideNonSelectedQuaysState[stopPlace.id]
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
                  />
                ) : (
                  ''
                ),
              )}
            </>
          ) : (
            <StopPlaceMarker
              stopPlace={stopPlace}
              key={stopPlace.id}
              showQuaysCallback={() => {
                showQuaysCallback(true, stopPlace.id);
              }}
            />
          );
        })}
      </MarkerClusterGroup>
    </FormMap>
  );
};
