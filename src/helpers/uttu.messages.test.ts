import { describe, it, expect } from 'vitest';
import {
  isOfUttuMessage,
  UttuCode,
  CombinedUttuCode,
  UttuSubCode,
} from './uttu.messages';

describe('uttu.messages', () => {
  describe('isOfUttuMessage', () => {
    describe('UttuCode values', () => {
      it.each(Object.values(UttuCode))(
        'should return true for UttuCode.%s',
        (code) => {
          expect(isOfUttuMessage(code)).toBe(true);
        },
      );
    });

    describe('CombinedUttuCode values', () => {
      it.each(Object.values(CombinedUttuCode))(
        'should return true for CombinedUttuCode.%s',
        (code) => {
          expect(isOfUttuMessage(code)).toBe(true);
        },
      );
    });

    describe('UttuSubCode values (should NOT be included)', () => {
      it.each(Object.values(UttuSubCode))(
        'should return false for UttuSubCode.%s',
        (code) => {
          expect(isOfUttuMessage(code)).toBe(false);
        },
      );
    });

    describe('invalid values', () => {
      it('should return false for an empty string', () => {
        expect(isOfUttuMessage('')).toBe(false);
      });

      it('should return false for an arbitrary string', () => {
        expect(isOfUttuMessage('INVALID_CODE')).toBe(false);
      });

      it('should return false for lowercase versions of valid codes', () => {
        expect(isOfUttuMessage('constraint_violation')).toBe(false);
        expect(isOfUttuMessage('unknown')).toBe(false);
      });

      it('should return false for partial matches', () => {
        expect(isOfUttuMessage('CONSTRAINT')).toBe(false);
        expect(isOfUttuMessage('VIOLATION')).toBe(false);
      });
    });
  });

  describe('UttuCode enum', () => {
    it('should have all expected error codes', () => {
      expect(UttuCode.CONSTRAINT_VIOLATION).toBe('CONSTRAINT_VIOLATION');
      expect(UttuCode.ENTITY_IS_REFERENCED).toBe('ENTITY_IS_REFERENCED');
      expect(UttuCode.FROM_DATE_AFTER_TO_DATE).toBe('FROM_DATE_AFTER_TO_DATE');
      expect(UttuCode.MINIMUM_POINTS_IN_SEQUENCE).toBe(
        'MINIMUM_POINTS_IN_SEQUENCE',
      );
      expect(UttuCode.MISSING_OPERATOR).toBe('MISSING_OPERATOR');
      expect(UttuCode.NO_VALID_LINES_IN_DATA_SPACE).toBe(
        'NO_VALID_LINES_IN_DATA_SPACE',
      );
      expect(UttuCode.ORGANISATION_NOT_VALID_OPERATOR).toBe(
        'ORGANISATION_NOT_VALID_OPERATOR',
      );
      expect(UttuCode.NO_EMPTY_NOTICES).toBe('NO_EMPTY_NOTICES');
      expect(UttuCode.FLEXIBLE_LINE_REQUIRES_BOOKING).toBe(
        'FLEXIBLE_LINE_REQUIRES_BOOKING',
      );
      expect(UttuCode.INVALID_POLYGON).toBe('INVALID_POLYGON');
      expect(UttuCode.UNKNOWN).toBe('UNKNOWN');
    });

    it('should have exactly 11 codes', () => {
      expect(Object.keys(UttuCode)).toHaveLength(11);
    });
  });

  describe('CombinedUttuCode enum', () => {
    it('should have all expected combined codes', () => {
      expect(CombinedUttuCode.CONSTRAINT_VIOLATION_LINE_UNIQUE_NAME).toBe(
        'CONSTRAINT_VIOLATION_LINE_UNIQUE_NAME',
      );
      expect(
        CombinedUttuCode.CONSTRAINT_VIOLATION_SERVICE_JOURNEY_UNIQUE_NAME,
      ).toBe('CONSTRAINT_VIOLATION_SERVICE_JOURNEY_UNIQUE_NAME');
      expect(
        CombinedUttuCode.CONSTRAINT_VIOLATION_JOURNEY_PATTERN_UNIQUE_NAME,
      ).toBe('CONSTRAINT_VIOLATION_JOURNEY_PATTERN_UNIQUE_NAME');
    });

    it('should have exactly 3 codes', () => {
      expect(Object.keys(CombinedUttuCode)).toHaveLength(3);
    });
  });
});
