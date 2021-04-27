import FlexibleArea from './FlexibleArea';
import HailAndRideArea from './HailAndRideArea';
import VersionedType from 'model/VersionedType';
import { KeyValues } from './KeyValues';

type FlexibleStopPlace = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  transportMode?: string;
  flexibleArea?: FlexibleArea;
  hailAndRideArea?: HailAndRideArea;
  keyValues?: KeyValues[];
};

export default FlexibleStopPlace;
