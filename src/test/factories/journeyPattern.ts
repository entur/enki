import JourneyPattern from 'model/JourneyPattern';
import { DIRECTION_TYPE } from 'model/enums';
import Notice from 'model/Notice';
import { DeepPartial } from './types';
import { createTestId, deepMerge } from './utils';
import {
  createStopPointSequence,
  createFlexibleStopPointSequence,
} from './stopPoint';
import { createServiceJourneyWithPassingTimes } from './serviceJourney';

const DEFAULT_STOP_COUNT = 3;

/**
 * Create a JourneyPattern with sensible defaults
 * Default: 3 stop points, 1 service journey with matching passing times
 */
export const createJourneyPattern = (
  overrides?: DeepPartial<JourneyPattern>,
): JourneyPattern => {
  const stopCount = DEFAULT_STOP_COUNT;
  const defaults: JourneyPattern = {
    id: createTestId('JourneyPattern'),
    name: 'Test Journey Pattern',
    description: null,
    privateCode: null,
    directionType: DIRECTION_TYPE.OUTBOUND,
    pointsInSequence: createStopPointSequence(stopCount),
    serviceJourneys: [createServiceJourneyWithPassingTimes(stopCount)],
    notices: [],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a JourneyPattern with a specific number of stops
 * @param stopCount - Number of stops
 * @param serviceJourneyCount - Number of service journeys (default 1)
 */
export const createJourneyPatternWithStops = (
  stopCount: number,
  serviceJourneyCount: number = 1,
  overrides?: DeepPartial<JourneyPattern>,
): JourneyPattern => {
  const serviceJourneys = Array.from(
    { length: serviceJourneyCount },
    (_, i) => createServiceJourneyWithPassingTimes(stopCount, 9 + i * 2), // Stagger start times
  );

  return createJourneyPattern({
    pointsInSequence: createStopPointSequence(stopCount),
    serviceJourneys,
    ...overrides,
  });
};

/**
 * Create a JourneyPattern with multiple service journeys
 * @param serviceJourneyCount - Number of service journeys
 * @param stopCount - Number of stops (default 3)
 */
export const createJourneyPatternWithServiceJourneys = (
  serviceJourneyCount: number,
  stopCount: number = DEFAULT_STOP_COUNT,
  overrides?: DeepPartial<JourneyPattern>,
): JourneyPattern => {
  return createJourneyPatternWithStops(
    stopCount,
    serviceJourneyCount,
    overrides,
  );
};

/**
 * Create a JourneyPattern for flexible lines (with flexible stop points)
 */
export const createFlexibleJourneyPattern = (
  stopCount: number = DEFAULT_STOP_COUNT,
  overrides?: DeepPartial<JourneyPattern>,
): JourneyPattern => {
  return createJourneyPattern({
    pointsInSequence: createFlexibleStopPointSequence(stopCount),
    serviceJourneys: [createServiceJourneyWithPassingTimes(stopCount)],
    ...overrides,
  });
};

/**
 * Create a JourneyPattern with notices
 */
export const createJourneyPatternWithNotices = (
  notices: Notice[],
  overrides?: DeepPartial<JourneyPattern>,
): JourneyPattern => {
  return createJourneyPattern({
    notices,
    ...overrides,
  });
};

/**
 * Create an inbound JourneyPattern
 */
export const createInboundJourneyPattern = (
  overrides?: DeepPartial<JourneyPattern>,
): JourneyPattern => {
  return createJourneyPattern({
    directionType: DIRECTION_TYPE.INBOUND,
    name: 'Inbound Route',
    ...overrides,
  });
};

/**
 * Create an empty JourneyPattern (for form initialization)
 */
export const createEmptyJourneyPattern = (): JourneyPattern => ({
  pointsInSequence: [],
  serviceJourneys: [],
});

/**
 * Create a minimal JourneyPattern (2 stops, minimal config)
 */
export const createMinimalJourneyPattern = (
  overrides?: DeepPartial<JourneyPattern>,
): JourneyPattern => {
  return createJourneyPatternWithStops(2, 1, overrides);
};
