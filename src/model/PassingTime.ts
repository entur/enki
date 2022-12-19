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

export const passingTimeToPayload = (
  pt: PassingTime,
  i: number,
  length: number
) => {
  const {
    arrivalTime,
    arrivalDayOffset,
    departureTime,
    departureDayOffset,
    earliestDepartureTime,
    earliestDepartureDayOffset,
    latestArrivalTime,
    latestArrivalDayOffset,
    ...rest
  } = pt;

  if (earliestDepartureTime && latestArrivalTime) {
    return {
      ...rest,
      earliestDepartureTime,
      earliestDepartureDayOffset,
      latestArrivalTime,
      latestArrivalDayOffset,
    };
  }

  if (
    arrivalTime &&
    departureTime &&
    arrivalTime === departureTime &&
    arrivalDayOffset === departureDayOffset
  ) {
    if (i < length - 1) {
      return {
        ...rest,
        departureTime,
        departureDayOffset,
      };
    } else if (i === length - 1) {
      return {
        ...rest,
        arrivalTime,
        arrivalDayOffset,
      };
    }
  }

  if (i === 0) {
    return {
      ...rest,
      departureTime,
      departureDayOffset,
    };
  } else if (i === length - 1) {
    return {
      ...rest,
      arrivalTime,
      arrivalDayOffset,
    };
  }

  return {
    ...rest,
    departureTime,
    departureDayOffset,
    arrivalTime,
    arrivalDayOffset,
  };
};

export default PassingTime;
