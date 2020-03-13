import { VersionedType } from './base/VersionedType';
import Notice from './Notice';

type PassingTime = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  arrivalTime?: string;
  arrivalDayOffset?: number;
  departureTime?: string;
  departureDayOffset?: number;
  latestArrivalTime?: string;
  latestArrivalDayOffset?: number;
  earliestDepartureTime?: string;
  earliestDepartureDayOffset?: number;
  notices?: Notice[];
};

export default PassingTime;
