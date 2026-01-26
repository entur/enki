import { createUuid } from 'helpers/generators';
import FlexibleLine from 'model/FlexibleLine';
import JourneyPattern from 'model/JourneyPattern';

/**
 * Normalizes a FlexibleLine received from the API by:
 * 1. Adding unique keys to each point in sequence (for React list rendering)
 * 2. Extracting flexibleStopPlaceRef from nested flexibleStopPlace object
 * 3. Extracting networkRef from nested network object
 * 4. Extracting brandingRef from nested branding object
 *
 * Returns a new FlexibleLine object without mutating the original.
 */
export const normalizeFlexibleLineFromApi = (
  line: FlexibleLine,
): FlexibleLine => {
  const normalizedJourneyPatterns: JourneyPattern[] =
    line?.journeyPatterns?.map((jp) => ({
      ...jp,
      pointsInSequence: jp.pointsInSequence.map((pis) => ({
        ...pis,
        key: createUuid(),
        flexibleStopPlaceRef: pis.flexibleStopPlace?.id,
      })),
    })) ?? [];

  return {
    ...line,
    networkRef: line.network?.id,
    brandingRef: line.branding?.id,
    journeyPatterns: normalizedJourneyPatterns,
  };
};
