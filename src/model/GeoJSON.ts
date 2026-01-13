import kinks from '@turf/kinks';
import booleanClockwise from '@turf/boolean-clockwise';
import { polygon } from '@turf/helpers';

export type Coordinate = [number, number];

type GeoJSON = {
  type?: string;
  coordinates?: Coordinate[];
};

export const addCoordinate = (
  coordinates: Coordinate[],
  coordinate: Coordinate,
) => {
  // The polygon must be closed: first coordinate == last coordinate.
  const lastCoordinate = coordinates[coordinates.length - 1] ?? coordinate;
  return [...coordinates.slice(0, -1), coordinate, lastCoordinate];
};

export const removeLastCoordinate = (
  coordinates: Coordinate[],
): Coordinate[] => {
  if (coordinates.length > 2) {
    const lastCoordinate: Coordinate = coordinates[coordinates.length - 1];
    return [...coordinates.slice(0, -2), lastCoordinate];
  } else {
    return [];
  }
};

const coordinateListRegEx =
  /^\[(\[\d+(\.\d*)?,\d+(\.\d*)?\])?(,\[\d+(\.\d*)?,\d+(\.\d*)?\])*\]$/;

export const stringIsValidCoordinates = (s: string) => {
  const strippedString = s.replace(/\s/g, '');
  return coordinateListRegEx.test(strippedString);
};

// ============= POLYGON VALIDATION CODE =============

/**
 * Validation error types for polygon geometry
 */
export type PolygonValidationErrorType =
  | 'format' // Invalid JSON format
  | 'minCoordinates' // Less than 4 coordinates
  | 'selfIntersecting' // Edges cross each other
  | 'empty'; // No coordinates provided

export type PolygonValidationError = {
  type: PolygonValidationErrorType;
  messageKey: string;
  details?: {
    intersectionCount?: number;
  };
};

export type PolygonValidationResult = {
  valid: boolean;
  error?: PolygonValidationError;
  normalizedCoordinates?: Coordinate[];
  corrections?: {
    closedPolygon: boolean;
    fixedWindingOrder: boolean;
  };
};

/**
 * Check if a polygon is closed (first coordinate equals last)
 */
export const isPolygonClosed = (coordinates: Coordinate[]): boolean => {
  if (coordinates.length < 2) return false;

  const first = coordinates[0];
  const last = coordinates[coordinates.length - 1];

  return first[0] === last[0] && first[1] === last[1];
};

/**
 * Ensure polygon is closed by appending first coordinate if needed
 */
export const ensurePolygonClosed = (
  coordinates: Coordinate[],
): Coordinate[] => {
  if (coordinates.length < 1) return coordinates;
  if (isPolygonClosed(coordinates)) return coordinates;

  return [...coordinates, coordinates[0]];
};

/**
 * Check if coordinates form a clockwise polygon using the shoelace formula
 * For GeoJSON, exterior rings should be counter-clockwise (returns false)
 */
export const isClockwise = (coordinates: Coordinate[]): boolean => {
  if (coordinates.length < 4) return false;

  try {
    const poly = polygon([coordinates]);
    return booleanClockwise(poly.geometry.coordinates[0]);
  } catch {
    return false;
  }
};

/**
 * Fix winding order to counter-clockwise (RFC 7946 compliant for exterior rings)
 */
export const ensureCounterClockwise = (
  coordinates: Coordinate[],
): Coordinate[] => {
  if (coordinates.length < 4) return coordinates;
  if (!isClockwise(coordinates)) return coordinates;

  // Reverse the array but keep closure
  // If closed: [A, B, C, A] -> reverse middle, keep first/last: [A, C, B, A]
  if (isPolygonClosed(coordinates)) {
    const middle = coordinates.slice(1, -1);
    return [coordinates[0], ...middle.reverse(), coordinates[0]];
  }

  return coordinates.slice().reverse();
};

/**
 * Detect self-intersections in a polygon
 * Returns the number of intersection points found
 */
export const detectSelfIntersections = (coordinates: Coordinate[]): number => {
  if (coordinates.length < 4) return 0;

  try {
    const poly = polygon([coordinates]);
    const intersections = kinks(poly);
    return intersections.features.length;
  } catch {
    return 0;
  }
};

/**
 * Comprehensive polygon validation and normalization
 *
 * This function:
 * 1. Auto-fixes polygon closure (appends first coordinate if needed)
 * 2. Auto-fixes winding order (reverses to counter-clockwise if needed)
 * 3. Detects self-intersections (returns error, cannot auto-fix)
 *
 * @param coordinates - Array of [longitude, latitude] coordinates
 * @returns Validation result with normalized coordinates or error
 */
export const validateAndNormalizePolygon = (
  coordinates: Coordinate[],
): PolygonValidationResult => {
  // Check for empty coordinates
  if (!coordinates || coordinates.length === 0) {
    return {
      valid: false,
      error: {
        type: 'empty',
        messageKey: 'errorCoordinatesEmpty',
      },
    };
  }

  // Check minimum coordinates (GeoJSON polygon requires at least 4 points including closure)
  if (coordinates.length < 3) {
    return {
      valid: false,
      error: {
        type: 'minCoordinates',
        messageKey: 'validateFormErrorFlexibleAreaNotEnoughPolygons',
      },
    };
  }

  // Track corrections made
  const corrections = {
    closedPolygon: false,
    fixedWindingOrder: false,
  };

  // Step 1: Ensure polygon is closed
  let normalized = coordinates;
  if (!isPolygonClosed(normalized)) {
    normalized = ensurePolygonClosed(normalized);
    corrections.closedPolygon = true;
  }

  // After closure, check minimum coordinates again
  if (normalized.length < 4) {
    return {
      valid: false,
      error: {
        type: 'minCoordinates',
        messageKey: 'validateFormErrorFlexibleAreaNotEnoughPolygons',
      },
    };
  }

  // Step 2: Ensure counter-clockwise winding (RFC 7946)
  if (isClockwise(normalized)) {
    normalized = ensureCounterClockwise(normalized);
    corrections.fixedWindingOrder = true;
  }

  // Step 3: Check for self-intersections (cannot auto-fix)
  const intersectionCount = detectSelfIntersections(normalized);
  if (intersectionCount > 0) {
    return {
      valid: false,
      error: {
        type: 'selfIntersecting',
        messageKey: 'errorCoordinatesSelfIntersecting',
        details: { intersectionCount },
      },
      normalizedCoordinates: normalized,
      corrections,
    };
  }

  // All validations passed
  return {
    valid: true,
    normalizedCoordinates: normalized,
    corrections,
  };
};

/**
 * Validate a string as coordinate input and optionally normalize the polygon
 *
 * @param input - String input from text field
 * @returns Validation result with parsed and normalized coordinates, or error
 */
export const validateCoordinateInput = (
  input: string,
): PolygonValidationResult => {
  // Empty input is valid (optional field)
  if (!input || input.trim() === '') {
    return {
      valid: true,
      normalizedCoordinates: [],
    };
  }

  // First check format with existing regex
  if (!stringIsValidCoordinates(input)) {
    return {
      valid: false,
      error: {
        type: 'format',
        messageKey: 'errorCoordinates',
      },
    };
  }

  // Parse the JSON
  let coordinates: Coordinate[];
  try {
    coordinates = JSON.parse(input);
  } catch {
    return {
      valid: false,
      error: {
        type: 'format',
        messageKey: 'errorCoordinates',
      },
    };
  }

  // Validate and normalize the parsed coordinates
  return validateAndNormalizePolygon(coordinates);
};

export default GeoJSON;
