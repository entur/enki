import { describe, it, expect } from 'vitest';
import {
  Coordinate,
  addCoordinate,
  removeLastCoordinate,
  stringIsValidCoordinates,
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
