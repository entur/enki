import { VersionedType } from 'model/VersionedType';
import Notice from './Notice';

type PassingTime = VersionedType & {
  name?: string;
  description?: string;
  privateCode?: string;
  arrivalTime?: string | null;
  arrivalDayOffset?: number;
  departureTime?: string | null;
  departureDayOffset?: number;
  latestArrivalTime?: string | null;
  latestArrivalDayOffset?: number;
  earliestDepartureTime?: string | null;
  earliestDepartureDayOffset?: number;
  notices?: Notice[];
};

export default PassingTime;
