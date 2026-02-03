import { describe, it, expect } from 'vitest';
import {
  Coordinate,
  addCoordinate,
  removeLastCoordinate,
  stringIsValidCoordinates,
  isPolygonClosed,
  ensurePolygonClosed,
  isClockwise,
  ensureCounterClockwise,
  detectSelfIntersections,
  validateAndNormalizePolygon,
  validateCoordinateInput,
} from './GeoJSON';

describe('GeoJSON', () => {
  describe('addCoordinate', () => {
    describe('basic functionality', () => {
      it('should add coordinate to empty array and create closed polygon', () => {
        const coordinate: Coordinate = [10.5, 59.9];
        const result = addCoordinate([], coordinate);

        expect(result).toEqual([
          [10.5, 59.9],
          [10.5, 59.9],
        ]);
      });

      it('should add coordinate to array with one point and maintain closure', () => {
        const existing: Coordinate[] = [[10.0, 60.0]];
        const newCoord: Coordinate = [10.5, 59.9];
        const result = addCoordinate(existing, newCoord);

        expect(result).toEqual([
          [10.5, 59.9],
          [10.0, 60.0],
        ]);
      });

      it('should add coordinate to closed polygon and maintain closure', () => {
        const existing: Coordinate[] = [
          [10.0, 60.0],
          [11.0, 60.0],
          [10.0, 60.0],
        ];
        const newCoord: Coordinate = [10.5, 59.5];
        const result = addCoordinate(existing, newCoord);

        expect(result).toEqual([
          [10.0, 60.0],
          [11.0, 60.0],
          [10.5, 59.5],
          [10.0, 60.0],
        ]);
      });
    });

    describe('polygon closure invariant', () => {
      it('should ensure first and last coordinates are equal', () => {
        const existing: Coordinate[] = [
          [1, 1],
          [2, 2],
          [1, 1],
        ];
        const newCoord: Coordinate = [3, 3];
        const result = addCoordinate(existing, newCoord);

        expect(result[0]).toEqual(result[result.length - 1]);
      });

      it('should insert new coordinate before the closing coordinate', () => {
        const existing: Coordinate[] = [
          [1, 1],
          [2, 2],
          [1, 1],
        ];
        const newCoord: Coordinate = [3, 3];
        const result = addCoordinate(existing, newCoord);

        expect(result[result.length - 2]).toEqual([3, 3]);
      });
    });

    describe('edge cases', () => {
      it('should handle coordinates with decimal precision', () => {
        const coordinate: Coordinate = [10.123456, 59.987654];
        const result = addCoordinate([], coordinate);

        expect(result).toEqual([
          [10.123456, 59.987654],
          [10.123456, 59.987654],
        ]);
      });

      it('should handle zero coordinates', () => {
        const coordinate: Coordinate = [0, 0];
        const result = addCoordinate([], coordinate);

        expect(result).toEqual([
          [0, 0],
          [0, 0],
        ]);
      });
    });
  });

  describe('removeLastCoordinate', () => {
    describe('basic functionality', () => {
      it('should remove second-to-last coordinate from polygon with 3+ points', () => {
        const coordinates: Coordinate[] = [
          [1, 1],
          [2, 2],
          [3, 3],
          [1, 1],
        ];
        const result = removeLastCoordinate(coordinates);

        expect(result).toEqual([
          [1, 1],
          [2, 2],
          [1, 1],
        ]);
      });

      it('should maintain closure after removal', () => {
        const coordinates: Coordinate[] = [
          [1, 1],
          [2, 2],
          [3, 3],
          [1, 1],
        ];
        const result = removeLastCoordinate(coordinates);

        expect(result[0]).toEqual(result[result.length - 1]);
      });
    });

    describe('minimum coordinate threshold', () => {
      it('should return empty array when coordinates length is 2', () => {
        const coordinates: Coordinate[] = [
          [1, 1],
          [1, 1],
        ];
        const result = removeLastCoordinate(coordinates);

        expect(result).toEqual([]);
      });

      it('should return empty array when coordinates length is 1', () => {
        const coordinates: Coordinate[] = [[1, 1]];
        const result = removeLastCoordinate(coordinates);

        expect(result).toEqual([]);
      });

      it('should return empty array when coordinates array is empty', () => {
        const coordinates: Coordinate[] = [];
        const result = removeLastCoordinate(coordinates);

        expect(result).toEqual([]);
      });
    });

    describe('edge cases', () => {
      it('should correctly remove from exactly 3 coordinates', () => {
        const coordinates: Coordinate[] = [
          [1, 1],
          [2, 2],
          [1, 1],
        ];
        const result = removeLastCoordinate(coordinates);

        expect(result).toEqual([
          [1, 1],
          [1, 1],
        ]);
      });

      it('should handle coordinates with decimal values', () => {
        const coordinates: Coordinate[] = [
          [10.5, 59.9],
          [11.5, 60.9],
          [12.5, 61.9],
          [10.5, 59.9],
        ];
        const result = removeLastCoordinate(coordinates);

        expect(result).toEqual([
          [10.5, 59.9],
          [11.5, 60.9],
          [10.5, 59.9],
        ]);
      });
    });
  });

  describe('stringIsValidCoordinates', () => {
    describe('valid coordinate strings', () => {
      it('should accept empty array', () => {
        expect(stringIsValidCoordinates('[]')).toBe(true);
      });

      it('should accept single coordinate with integers', () => {
        expect(stringIsValidCoordinates('[[1,2]]')).toBe(true);
      });

      it('should accept single coordinate with decimals', () => {
        expect(stringIsValidCoordinates('[[10.5,59.9]]')).toBe(true);
      });

      it('should accept multiple coordinates', () => {
        expect(stringIsValidCoordinates('[[1,2],[3,4],[5,6]]')).toBe(true);
      });

      it('should accept coordinates with varying decimal precision', () => {
        expect(stringIsValidCoordinates('[[10.123456,59.987654]]')).toBe(true);
      });

      it('should accept coordinates with trailing decimal point', () => {
        expect(stringIsValidCoordinates('[[10.,59.]]')).toBe(true);
      });
    });

    describe('whitespace handling', () => {
      it('should accept string with spaces', () => {
        expect(stringIsValidCoordinates('[ [1, 2], [3, 4] ]')).toBe(true);
      });

      it('should accept string with newlines', () => {
        expect(stringIsValidCoordinates('[\n  [1, 2],\n  [3, 4]\n]')).toBe(
          true,
        );
      });

      it('should accept string with tabs', () => {
        expect(stringIsValidCoordinates('[\t[1,2],\t[3,4]\t]')).toBe(true);
      });

      it('should accept string with mixed whitespace', () => {
        expect(stringIsValidCoordinates('[ \n\t [1,2] , \n [3,4] \t]')).toBe(
          true,
        );
      });
    });

    describe('invalid coordinate strings', () => {
      it('should reject empty string', () => {
        expect(stringIsValidCoordinates('')).toBe(false);
      });

      it('should reject string with only whitespace', () => {
        expect(stringIsValidCoordinates('   ')).toBe(false);
      });

      it('should reject malformed JSON', () => {
        expect(stringIsValidCoordinates('[1,2]')).toBe(false);
      });

      it('should reject missing outer brackets', () => {
        expect(stringIsValidCoordinates('[1,2],[3,4]')).toBe(false);
      });

      it('should reject missing inner brackets', () => {
        expect(stringIsValidCoordinates('[1,2,3,4]')).toBe(false);
      });

      it('should reject strings with letters', () => {
        expect(stringIsValidCoordinates('[[abc,def]]')).toBe(false);
      });

      it('should reject negative numbers (regex limitation)', () => {
        expect(stringIsValidCoordinates('[[-10.5,59.9]]')).toBe(false);
      });

      it('should reject coordinates with three values', () => {
        expect(stringIsValidCoordinates('[[1,2,3]]')).toBe(false);
      });

      it('should reject coordinates with single value', () => {
        expect(stringIsValidCoordinates('[[1]]')).toBe(false);
      });

      it('should reject unclosed brackets', () => {
        expect(stringIsValidCoordinates('[[1,2]')).toBe(false);
      });
    });
  });
});

describe('GeoJSON Polygon Validation', () => {
  // Test coordinates - simple square (counter-clockwise)
  const ccwSquare: Coordinate[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
    [0, 0], // closed
  ];

  // Clockwise version of the same square
  const cwSquare: Coordinate[] = [
    [0, 0],
    [0, 1],
    [1, 1],
    [1, 0],
    [0, 0], // closed
  ];

  // Unclosed square (missing last coordinate)
  const unclosedSquare: Coordinate[] = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];

  // Self-intersecting polygon (bowtie/figure-8 shape)
  const selfIntersecting: Coordinate[] = [
    [0, 0],
    [2, 2],
    [2, 0],
    [0, 2],
    [0, 0],
  ];

  describe('isPolygonClosed', () => {
    it('returns true for closed polygon', () => {
      expect(isPolygonClosed(ccwSquare)).toBe(true);
    });

    it('returns false for unclosed polygon', () => {
      expect(isPolygonClosed(unclosedSquare)).toBe(false);
    });

    it('returns false for empty array', () => {
      expect(isPolygonClosed([])).toBe(false);
    });

    it('returns false for single coordinate', () => {
      expect(isPolygonClosed([[0, 0]])).toBe(false);
    });
  });

  describe('ensurePolygonClosed', () => {
    it('returns same array for already closed polygon', () => {
      const result = ensurePolygonClosed(ccwSquare);
      expect(result).toEqual(ccwSquare);
    });

    it('appends first coordinate to close polygon', () => {
      const result = ensurePolygonClosed(unclosedSquare);
      expect(result.length).toBe(5);
      expect(result[result.length - 1]).toEqual(result[0]);
    });

    it('handles empty array', () => {
      expect(ensurePolygonClosed([])).toEqual([]);
    });
  });

  describe('isClockwise', () => {
    it('returns false for counter-clockwise polygon', () => {
      expect(isClockwise(ccwSquare)).toBe(false);
    });

    it('returns true for clockwise polygon', () => {
      expect(isClockwise(cwSquare)).toBe(true);
    });

    it('returns false for too few coordinates', () => {
      expect(
        isClockwise([
          [0, 0],
          [1, 1],
        ]),
      ).toBe(false);
    });
  });

  describe('ensureCounterClockwise', () => {
    it('returns same array for counter-clockwise polygon', () => {
      const result = ensureCounterClockwise(ccwSquare);
      expect(isClockwise(result)).toBe(false);
    });

    it('reverses clockwise polygon to counter-clockwise', () => {
      const result = ensureCounterClockwise(cwSquare);
      expect(isClockwise(result)).toBe(false);
      expect(result.length).toBe(cwSquare.length);
    });

    it('maintains closure after reversal', () => {
      const result = ensureCounterClockwise(cwSquare);
      expect(isPolygonClosed(result)).toBe(true);
    });
  });

  describe('detectSelfIntersections', () => {
    it('returns 0 for simple polygon', () => {
      expect(detectSelfIntersections(ccwSquare)).toBe(0);
    });

    it('returns positive number for self-intersecting polygon', () => {
      expect(detectSelfIntersections(selfIntersecting)).toBeGreaterThan(0);
    });

    it('returns 0 for too few coordinates', () => {
      expect(
        detectSelfIntersections([
          [0, 0],
          [1, 1],
        ]),
      ).toBe(0);
    });
  });

  describe('validateAndNormalizePolygon', () => {
    it('returns valid result for valid polygon', () => {
      const result = validateAndNormalizePolygon(ccwSquare);
      expect(result.valid).toBe(true);
      expect(result.normalizedCoordinates).toEqual(ccwSquare);
    });

    it('auto-closes unclosed polygon', () => {
      const result = validateAndNormalizePolygon(unclosedSquare);
      expect(result.valid).toBe(true);
      expect(result.corrections?.closedPolygon).toBe(true);
      expect(isPolygonClosed(result.normalizedCoordinates!)).toBe(true);
    });

    it('auto-corrects clockwise to counter-clockwise', () => {
      const result = validateAndNormalizePolygon(cwSquare);
      expect(result.valid).toBe(true);
      expect(result.corrections?.fixedWindingOrder).toBe(true);
      expect(isClockwise(result.normalizedCoordinates!)).toBe(false);
    });

    it('returns error for self-intersecting polygon', () => {
      const result = validateAndNormalizePolygon(selfIntersecting);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe('selfIntersecting');
      expect(result.error?.details?.intersectionCount).toBeGreaterThan(0);
    });

    it('returns error for empty coordinates', () => {
      const result = validateAndNormalizePolygon([]);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe('empty');
    });

    it('returns error for too few coordinates', () => {
      const result = validateAndNormalizePolygon([
        [0, 0],
        [1, 1],
      ]);
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe('minCoordinates');
    });
  });

  describe('validateCoordinateInput', () => {
    it('returns valid for empty string', () => {
      const result = validateCoordinateInput('');
      expect(result.valid).toBe(true);
    });

    it('returns format error for invalid JSON', () => {
      const result = validateCoordinateInput('not valid json');
      expect(result.valid).toBe(false);
      expect(result.error?.type).toBe('format');
    });

    it('returns valid for valid JSON coordinates', () => {
      const input = JSON.stringify(ccwSquare);
      const result = validateCoordinateInput(input);
      expect(result.valid).toBe(true);
    });

    it('parses and normalizes coordinates', () => {
      const input = JSON.stringify(unclosedSquare);
      const result = validateCoordinateInput(input);
      expect(result.valid).toBe(true);
      expect(result.corrections?.closedPolygon).toBe(true);
    });
  });
});
