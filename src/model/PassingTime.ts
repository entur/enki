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
  length: number,
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

  if (!departureTime && !arrivalTime) {
    return {
      ...rest,
      earliestDepartureTime,
      earliestDepartureDayOffset,
      latestArrivalTime,
      latestArrivalDayOffset,
      arrivalTime: null,
      arrivalDayOffset: 0,
      departureTime: null,
      departureDayOffset: 0,
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
        arrivalTime: null,
        arrivalDayOffset: 0,
        earliestDepartureTime: null,
        earliestDepartureDayOffset: 0,
        latestArrivalTime: null,
        latestArrivalDayOffset: 0,
      };
    } else if (i === length - 1) {
      return {
        ...rest,
        arrivalTime,
        arrivalDayOffset,
        departureTime: null,
        departureDayOffset: 0,
        earliestDepartureTime: null,
        earliestDepartureDayOffset: 0,
        latestArrivalTime: null,
        latestArrivalDayOffset: 0,
      };
    }
  }

  if (i === 0) {
    return {
      ...rest,
      departureTime,
      departureDayOffset,
      arrivalTime: null,
      arrivalDayOffset: 0,
      earliestDepartureTime: null,
      earliestDepartureDayOffset: 0,
      latestArrivalTime: null,
      latestArrivalDayOffset: 0,
    };
  } else if (i === length - 1) {
    return {
      ...rest,
      arrivalTime,
      arrivalDayOffset,
      departureTime: null,
      departureDayOffset: 0,
      earliestDepartureTime: null,
      earliestDepartureDayOffset: 0,
      latestArrivalTime: null,
      latestArrivalDayOffset: 0,
    };
  }

  return {
    ...rest,
    departureTime,
    departureDayOffset,
    arrivalTime,
    arrivalDayOffset,
    earliestDepartureTime: null,
    earliestDepartureDayOffset: 0,
    latestArrivalTime: null,
    latestArrivalDayOffset: 0,
  };
};

export default PassingTime;
