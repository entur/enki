import './styles.scss';
import FormMap from '../../components/FormMap';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import MarkerClusterGroup from 'react-leaflet-cluster';
import { useQuays } from '../../components/StopPointsEditor/Generic/QuaysContext';
import { useAppSelector } from '../../store/hooks';
import { useState } from 'react';
import StopPlaceMarker from './StopPlaceMarker';
import QuayMarker from './QuayMarker';
import { StopPlace } from '../../api';

/*let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow
});
L.Marker.prototype.options.icon = DefaultIcon;*/

export const JourneyPatternStopPointMap = () => {
  const { quaySelectionStates, setQuaySelectionStates } = useQuays();
  const stopPlaces = useAppSelector((state) => state.stopPlaces);
  const [showQuaysState, setShowQuaysState] = useState({});
  const [hideNonSelectedQuaysState, setHideNonSelectedQuaysState] = useState(
    {},
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
                      const newShowQuaysState = {
                        ...showQuaysState,
                      };
                      newShowQuaysState[stopPlace.id] = showAll;
                      setShowQuaysState(newShowQuaysState);
                    }}
                    hideNonSelectedQuaysCallback={(hideNonSelected) => {
                      const newHideNonSelectedQuaysState = {
                        ...hideNonSelectedQuaysState,
                      };
                      newHideNonSelectedQuaysState[stopPlace.id] =
                        hideNonSelected;
                      setHideNonSelectedQuaysState(
                        newHideNonSelectedQuaysState,
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
                const newShowQuaysState = {
                  ...showQuaysState,
                };
                newShowQuaysState[stopPlace.id] = true;
                setShowQuaysState(newShowQuaysState);
              }}
            />
          );
        })}
      </MarkerClusterGroup>
    </FormMap>
  );
};
