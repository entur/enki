import StopPoint from 'model/StopPoint';
import FlexibleStopPlace from 'model/FlexibleStopPlace';
import FlexibleArea from 'model/FlexibleArea';
import GeoJSON from 'model/GeoJSON';
import { DeepPartial } from './types';
import { createTestId, createStopPointKey, deepMerge } from './utils';
import { createBookingArrangement } from './bookingArrangement';

/**
 * Create a simple polygon GeoJSON for a flexible area
 * Default: Small area around Oslo coordinates
 */
export const createPolygonGeoJSON = (
  overrides?: DeepPartial<GeoJSON>,
): GeoJSON => {
  const defaults: GeoJSON = {
    type: 'Polygon',
    coordinates: [
      [10.0, 59.9],
      [10.1, 59.9],
      [10.1, 60.0],
      [10.0, 60.0],
      [10.0, 59.9], // Close the polygon
    ],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a FlexibleArea with a simple polygon
 */
export const createFlexibleArea = (
  overrides?: DeepPartial<FlexibleArea>,
): FlexibleArea => {
  const defaults: FlexibleArea = {
    id: createTestId('FlexibleArea'),
    name: 'Test Flexible Area',
    polygon: createPolygonGeoJSON(),
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a FlexibleStopPlace with sensible defaults
 */
export const createFlexibleStopPlace = (
  overrides?: DeepPartial<FlexibleStopPlace>,
): FlexibleStopPlace => {
  const flexibleArea = createFlexibleArea();
  const defaults: FlexibleStopPlace = {
    id: createTestId('FlexibleStopPlace'),
    name: 'Test Flexible Stop',
    transportMode: 'bus',
    flexibleArea,
    flexibleAreas: [flexibleArea],
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a StopPoint referencing an external Quay
 */
export const createQuayStopPoint = (
  quayRef?: string,
  overrides?: DeepPartial<StopPoint>,
): StopPoint => {
  const defaults: StopPoint = {
    id: createTestId('StopPointInJourneyPattern'),
    key: createStopPointKey(),
    quayRef: quayRef ?? createTestId('Quay'),
    flexibleStopPlace: undefined,
    flexibleStopPlaceRef: null,
    destinationDisplay: { frontText: 'City Center' },
    forBoarding: true,
    forAlighting: true,
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a StopPoint with a FlexibleStopPlace
 */
export const createFlexibleStopPoint = (
  overrides?: DeepPartial<StopPoint>,
): StopPoint => {
  const flexibleStopPlace = createFlexibleStopPlace();

  const defaults: StopPoint = {
    id: createTestId('StopPointInJourneyPattern'),
    key: createStopPointKey(),
    quayRef: null,
    flexibleStopPlace,
    flexibleStopPlaceRef: flexibleStopPlace.id,
    destinationDisplay: null,
    forBoarding: true,
    forAlighting: true,
    bookingArrangement: createBookingArrangement(),
  };

  return deepMerge(defaults, overrides);
};

/**
 * Create a first stop point (boarding only)
 */
export const createFirstStopPoint = (
  quayRef?: string,
  overrides?: DeepPartial<StopPoint>,
): StopPoint => {
  return createQuayStopPoint(quayRef, {
    forBoarding: true,
    forAlighting: false,
    destinationDisplay: { frontText: 'Terminus' },
    ...overrides,
  });
};

/**
 * Create a last stop point (alighting only)
 */
export const createLastStopPoint = (
  quayRef?: string,
  overrides?: DeepPartial<StopPoint>,
): StopPoint => {
  return createQuayStopPoint(quayRef, {
    forBoarding: false,
    forAlighting: true,
    destinationDisplay: null,
    ...overrides,
  });
};

/**
 * Create a sequence of stop points for a journey
 * @param count - Number of stops
 * @param quayRefs - Optional specific quay refs (generates if not provided)
 */
export const createStopPointSequence = (
  count: number,
  quayRefs?: string[],
): StopPoint[] => {
  const stops: StopPoint[] = [];

  for (let i = 0; i < count; i++) {
    const quayRef = quayRefs?.[i] ?? createTestId('Quay');

    if (i === 0) {
      stops.push(createFirstStopPoint(quayRef));
    } else if (i === count - 1) {
      stops.push(createLastStopPoint(quayRef));
    } else {
      stops.push(createQuayStopPoint(quayRef));
    }
  }

  return stops;
};

/**
 * Create a sequence of flexible stop points for a flexible line
 * @param count - Number of stops
 */
export const createFlexibleStopPointSequence = (count: number): StopPoint[] => {
  const stops: StopPoint[] = [];

  for (let i = 0; i < count; i++) {
    if (i === 0) {
      stops.push(
        createFlexibleStopPoint({
          forBoarding: true,
          forAlighting: false,
        }),
      );
    } else if (i === count - 1) {
      stops.push(
        createFlexibleStopPoint({
          forBoarding: false,
          forAlighting: true,
        }),
      );
    } else {
      stops.push(createFlexibleStopPoint());
    }
  }

  return stops;
};
