import { describe, it, expect } from 'vitest';
import {
  isPolygonClosed,
  ensurePolygonClosed,
  isClockwise,
  ensureCounterClockwise,
  detectSelfIntersections,
  validateAndNormalizePolygon,
  validateCoordinateInput,
  Coordinate,
} from './GeoJSON';

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
