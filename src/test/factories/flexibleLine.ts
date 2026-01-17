import FlexibleLine, { FlexibleLineType } from 'model/FlexibleLine';
import { VEHICLE_MODE } from 'model/enums';
import { DeepPartial } from './types';
import { createTestId, deepMerge } from './utils';
import { createFlexibleJourneyPattern } from './journeyPattern';
import { createBookingArrangement } from './bookingArrangement';
import { createNetwork } from './line';

/**
 * Create a FlexibleLine with sensible defaults
 * Default: Flexible areas only type, bus mode, 1 journey pattern with flexible stops
 */
export const createFlexibleLine = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  const defaults: FlexibleLine = {
    id: createTestId('FlexibleLine'),
    name: 'Test Flexible Line',
    description: 'A test flexible line for unit testing',
    privateCode: null,
    publicCode: 'FLEX1',
    transportMode: VEHICLE_MODE.BUS,
    transportSubmode: undefined,
    flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
    bookingArrangement: null,
    network: undefined,
    networkRef: undefined,
    operatorRef: undefined,
    branding: undefined,
    brandingRef: undefined,
    journeyPatterns: [createFlexibleJourneyPattern()],
    notices: [],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a FlexibleLine with booking arrangement
 */
export const createFlexibleLineWithBooking = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  return createFlexibleLine({
    bookingArrangement: createBookingArrangement(),
    ...overrides,
  });
};

/**
 * Create a FlexibleLine with Network attached
 */
export const createFlexibleLineWithNetwork = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  const network = createNetwork();
  return createFlexibleLine({
    network,
    networkRef: network.id,
    ...overrides,
  });
};

/**
 * Create a Corridor Service flexible line
 */
export const createCorridorServiceLine = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  return createFlexibleLine({
    flexibleLineType: FlexibleLineType.CORRIDOR_SERVICE,
    name: 'Corridor Service Line',
    ...overrides,
  });
};

/**
 * Create a Main Route with Flexible Ends line
 */
export const createMainRouteWithFlexibleEndsLine = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  return createFlexibleLine({
    flexibleLineType: FlexibleLineType.MAIN_ROUTE_WITH_FLEXIBLE_ENDS,
    name: 'Main Route with Flexible Ends',
    ...overrides,
  });
};

/**
 * Create a Hail and Ride line
 */
export const createHailAndRideLine = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  return createFlexibleLine({
    flexibleLineType: FlexibleLineType.HAIL_AND_RIDE_SECTIONS,
    name: 'Hail and Ride Line',
    ...overrides,
  });
};

/**
 * Create a Mixed Flexible line
 */
export const createMixedFlexibleLine = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  return createFlexibleLine({
    flexibleLineType: FlexibleLineType.MIXED_FLEXIBLE,
    name: 'Mixed Flexible Line',
    ...overrides,
  });
};

/**
 * Create a Fixed Stop Area Wide line
 */
export const createFixedStopAreaWideLine = (
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  return createFlexibleLine({
    flexibleLineType: FlexibleLineType.FIXED_STOP_AREA_WIDE,
    name: 'Fixed Stop Area Wide Line',
    ...overrides,
  });
};

/**
 * Create a FlexibleLine with a specific line type
 */
export const createFlexibleLineWithType = (
  flexibleLineType: FlexibleLineType,
  overrides?: DeepPartial<FlexibleLine>,
): FlexibleLine => {
  return createFlexibleLine({
    flexibleLineType,
    ...overrides,
  });
};

/**
 * Create an empty FlexibleLine (for form initialization)
 */
export const createEmptyFlexibleLine = (): FlexibleLine => ({
  flexibleLineType: FlexibleLineType.FLEXIBLE_AREAS_ONLY,
  journeyPatterns: [],
});
