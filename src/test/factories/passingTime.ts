import PassingTime from 'model/PassingTime';
import { DeepPartial } from './types';
import { createTestId, createTime, deepMerge } from './utils';

/**
 * Create a PassingTime with sensible defaults
 * Default: 09:00:00 departure, no arrival (suitable for first stop)
 */
export const createPassingTime = (
  overrides?: DeepPartial<PassingTime>,
): PassingTime => {
  const defaults: PassingTime = {
    id: createTestId('TimetabledPassingTime'),
    arrivalTime: null,
    arrivalDayOffset: 0,
    departureTime: createTime(9, 0),
    departureDayOffset: 0,
    latestArrivalTime: null,
    latestArrivalDayOffset: 0,
    earliestDepartureTime: null,
    earliestDepartureDayOffset: 0,
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a PassingTime for the first stop (departure only)
 */
export const createFirstStopPassingTime = (
  departureTime: string = createTime(9, 0),
  overrides?: DeepPartial<PassingTime>,
): PassingTime => {
  return createPassingTime({
    departureTime,
    arrivalTime: null,
    ...overrides,
  });
};

/**
 * Create a PassingTime for the last stop (arrival only)
 */
export const createLastStopPassingTime = (
  arrivalTime: string = createTime(10, 0),
  overrides?: DeepPartial<PassingTime>,
): PassingTime => {
  return createPassingTime({
    arrivalTime,
    departureTime: null,
    ...overrides,
  });
};

/**
 * Create a PassingTime for a middle stop (both arrival and departure)
 */
export const createMiddleStopPassingTime = (
  arrivalTime: string = createTime(9, 30),
  departureTime: string = createTime(9, 32),
  overrides?: DeepPartial<PassingTime>,
): PassingTime => {
  return createPassingTime({
    arrivalTime,
    departureTime,
    ...overrides,
  });
};

/**
 * Create a sequence of PassingTimes for a complete journey
 * @param count - Number of stops
 * @param startHour - Starting hour (default 9)
 * @param intervalMinutes - Minutes between stops (default 15)
 */
export const createPassingTimeSequence = (
  count: number,
  startHour: number = 9,
  intervalMinutes: number = 15,
): PassingTime[] => {
  const times: PassingTime[] = [];

  for (let i = 0; i < count; i++) {
    const minutes = startHour * 60 + i * intervalMinutes;
    const hour = Math.floor(minutes / 60) % 24;
    const minute = minutes % 60;
    const time = createTime(hour, minute);

    if (i === 0) {
      times.push(createFirstStopPassingTime(time));
    } else if (i === count - 1) {
      times.push(createLastStopPassingTime(time));
    } else {
      times.push(createMiddleStopPassingTime(time, time));
    }
  }

  return times;
};
