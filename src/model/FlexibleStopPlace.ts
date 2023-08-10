import VersionedType from 'model/VersionedType';
import FlexibleArea from './FlexibleArea';
import HailAndRideArea from './HailAndRideArea';
import { KeyValues } from './KeyValues';

type FlexibleStopPlace = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  transportMode?: string;
  flexibleArea?: FlexibleArea;
  flexibleAreas?: FlexibleArea[];
  hailAndRideArea?: HailAndRideArea;
  keyValues?: KeyValues[];
};

export const mapFlexibleAreasToArea = (
  flexibleStopPlace: FlexibleStopPlace
) => {
  if (flexibleStopPlace.flexibleAreas?.length) {
    return {
      ...flexibleStopPlace,
      flexibleArea: flexibleStopPlace.flexibleAreas[0],
    };
  }
  return flexibleStopPlace;
};

export default FlexibleStopPlace;
