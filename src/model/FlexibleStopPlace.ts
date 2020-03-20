import FlexibleArea from './FlexibleArea';
import HailAndRideArea from './HailAndRideArea';
import VersionedType from 'model/base/VersionedType';

type FlexibleStopPlace = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  transportMode?: string;
  flexibleArea?: FlexibleArea;
  hailAndRideArea?: HailAndRideArea;
};

export default FlexibleStopPlace;
