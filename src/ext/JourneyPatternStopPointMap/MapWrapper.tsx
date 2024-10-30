import './styles.scss';
import FormMap from '../../components/FormMap';
import JourneyPatternStopPointMap from './JourneyPatternStopPointMap';
import { MapWrapperProps } from './types';

export const MapWrapper = ({
  pointsInSequence,
  addStopPoint,
  deleteStopPoint,
  transportMode,
}: MapWrapperProps) => {
  return (
    <FormMap zoomControl={false} doubleClickZoom={false}>
      <JourneyPatternStopPointMap
        transportMode={transportMode}
        pointsInSequence={pointsInSequence}
        deleteStopPoint={deleteStopPoint}
        addStopPoint={addStopPoint}
      />
    </FormMap>
  );
};
