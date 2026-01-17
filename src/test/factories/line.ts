import Line from 'model/Line';
import { Network } from 'model/Network';
import { VEHICLE_MODE } from 'model/enums';
import Notice from 'model/Notice';
import { DeepPartial } from './types';
import { createTestId, deepMerge } from './utils';
import {
  createJourneyPattern,
  createJourneyPatternWithStops,
} from './journeyPattern';

/**
 * Create a Line with sensible defaults
 * Default: Bus line with 1 journey pattern (3 stops, 1 service journey)
 */
export const createLine = (overrides?: DeepPartial<Line>): Line => {
  const defaults: Line = {
    id: createTestId('Line'),
    name: 'Test Line',
    description: 'A test line for unit testing',
    privateCode: null,
    publicCode: '42',
    transportMode: VEHICLE_MODE.BUS,
    transportSubmode: undefined,
    network: undefined,
    networkRef: undefined,
    operatorRef: undefined,
    branding: undefined,
    brandingRef: undefined,
    journeyPatterns: [createJourneyPattern()],
    notices: [],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a Network for testing
 */
export const createNetwork = (overrides?: DeepPartial<Network>): Network => {
  const defaults: Network = {
    id: createTestId('Network'),
    name: 'Test Network',
    description: 'A test network',
    privateCode: undefined,
    authorityRef: 'TST:Authority:1',
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a Line with a Network attached
 */
export const createLineWithNetwork = (overrides?: DeepPartial<Line>): Line => {
  const network = createNetwork();
  return createLine({
    network,
    networkRef: network.id,
    ...overrides,
  });
};

/**
 * Create a Line with multiple journey patterns
 * @param journeyPatternCount - Number of journey patterns
 * @param stopsPerPattern - Number of stops per journey pattern (default 3)
 */
export const createLineWithJourneyPatterns = (
  journeyPatternCount: number,
  stopsPerPattern: number = 3,
  overrides?: DeepPartial<Line>,
): Line => {
  const journeyPatterns = Array.from({ length: journeyPatternCount }, () =>
    createJourneyPatternWithStops(stopsPerPattern),
  );

  return createLine({
    journeyPatterns,
    ...overrides,
  });
};

/**
 * Create a Line with a specific transport mode
 */
export const createLineWithMode = (
  transportMode: VEHICLE_MODE,
  overrides?: DeepPartial<Line>,
): Line => {
  return createLine({
    transportMode,
    ...overrides,
  });
};

/**
 * Create a Rail line
 */
export const createRailLine = (overrides?: DeepPartial<Line>): Line => {
  return createLineWithMode(VEHICLE_MODE.RAIL, {
    name: 'Test Rail Line',
    publicCode: 'R1',
    ...overrides,
  });
};

/**
 * Create a Tram line
 */
export const createTramLine = (overrides?: DeepPartial<Line>): Line => {
  return createLineWithMode(VEHICLE_MODE.TRAM, {
    name: 'Test Tram Line',
    publicCode: 'T1',
    ...overrides,
  });
};

/**
 * Create a Water/Ferry line
 */
export const createFerryLine = (overrides?: DeepPartial<Line>): Line => {
  return createLineWithMode(VEHICLE_MODE.WATER, {
    name: 'Test Ferry Line',
    publicCode: 'F1',
    ...overrides,
  });
};

/**
 * Create a Line with notices
 */
export const createLineWithNotices = (
  notices: Notice[],
  overrides?: DeepPartial<Line>,
): Line => {
  return createLine({
    notices,
    ...overrides,
  });
};

/**
 * Create an empty Line (for form initialization)
 */
export const createEmptyLine = (): Line => ({
  journeyPatterns: [],
});

/**
 * Create a minimal Line (2 stops, 1 journey pattern, 1 service journey)
 */
export const createMinimalLine = (overrides?: DeepPartial<Line>): Line => {
  return createLine({
    journeyPatterns: [createJourneyPatternWithStops(2, 1)],
    ...overrides,
  });
};
