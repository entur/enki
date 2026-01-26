import ServiceJourney from 'model/ServiceJourney';
import { DeepPartial } from './types';
import { createTestId, deepMerge } from './utils';
import { createPassingTime, createPassingTimeSequence } from './passingTime';
import { createDayType } from './dayType';
import { createBookingArrangement } from './bookingArrangement';

/**
 * Create a ServiceJourney with sensible defaults
 * Default: Single passing time (suitable for first stop), no day types
 */
export const createServiceJourney = (
  overrides?: DeepPartial<ServiceJourney>,
): ServiceJourney => {
  const defaults: ServiceJourney = {
    id: createTestId('ServiceJourney'),
    name: 'Test Service Journey',
    description: null,
    privateCode: null,
    publicCode: null,
    operatorRef: null,
    bookingArrangement: null,
    passingTimes: [createPassingTime()],
    dayTypes: [],
    notices: [],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a ServiceJourney with matching passing times for a stop count
 * @param stopCount - Number of stops (passing times will be created for each)
 * @param startHour - Starting hour (default 9)
 * @param intervalMinutes - Minutes between stops (default 15)
 */
export const createServiceJourneyWithPassingTimes = (
  stopCount: number,
  startHour: number = 9,
  intervalMinutes: number = 15,
  overrides?: DeepPartial<ServiceJourney>,
): ServiceJourney => {
  return createServiceJourney({
    passingTimes: createPassingTimeSequence(
      stopCount,
      startHour,
      intervalMinutes,
    ),
    ...overrides,
  });
};

/**
 * Create a ServiceJourney with day types attached
 */
export const createServiceJourneyWithDayTypes = (
  overrides?: DeepPartial<ServiceJourney>,
): ServiceJourney => {
  return createServiceJourney({
    dayTypes: [createDayType()],
    ...overrides,
  });
};

/**
 * Create a ServiceJourney with booking arrangement (for flexible lines)
 */
export const createServiceJourneyWithBooking = (
  overrides?: DeepPartial<ServiceJourney>,
): ServiceJourney => {
  return createServiceJourney({
    bookingArrangement: createBookingArrangement(),
    ...overrides,
  });
};

/**
 * Create a named ServiceJourney (e.g., "Morning Route", "Evening Express")
 */
export const createNamedServiceJourney = (
  name: string,
  overrides?: DeepPartial<ServiceJourney>,
): ServiceJourney => {
  return createServiceJourney({
    name,
    ...overrides,
  });
};

/**
 * Create an empty ServiceJourney (for form initialization)
 */
export const createEmptyServiceJourney = (): ServiceJourney => ({
  id: `new_${createTestId('ServiceJourney')}`,
  passingTimes: [],
});
