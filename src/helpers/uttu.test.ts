import {
  getUttuError,
  getStyledUttuError,
  getInternationalizedUttuError,
  UttuError,
} from './uttu';
import { UttuCode, UttuSubCode } from './uttu.messages';
import { IntlShape } from 'react-intl';
import { CombinedGraphQLErrors } from '@apollo/client';

// Mock IntlShape
const createMockIntl = (): IntlShape =>
  ({
    formatMessage: ({ id }: { id: string }) => `translated_${id}`,
  }) as unknown as IntlShape;

// Helper to create UttuError objects
const createUttuError = (
  message?: string,
  code?: UttuCode,
  subCode?: UttuSubCode,
): UttuError => ({
  name: 'UttuError',
  message: 'Error',
  response: message
    ? {
        errors: [
          {
            message,
            extensions: code
              ? { code, subCode: subCode!, metaData: {} }
              : undefined,
          },
        ],
      }
    : undefined,
});

describe('uttu', () => {
  describe('getUttuError', () => {
    it('should extract error message from UttuError', () => {
      const error = createUttuError('Line name must be unique');
      expect(getUttuError(error)).toBe('Line name must be unique');
    });

    it('should return null when response is undefined', () => {
      const error: UttuError = {
        name: 'UttuError',
        message: 'Error',
        response: undefined,
      };
      expect(getUttuError(error)).toBeNull();
    });

    it('should return null when errors array is empty', () => {
      const error: UttuError = {
        name: 'UttuError',
        message: 'Error',
        response: { errors: [] },
      };
      expect(getUttuError(error)).toBeNull();
    });

    it('should return null when first error has no message', () => {
      const error: UttuError = {
        name: 'UttuError',
        message: 'Error',
        response: { errors: [{}] },
      };
      expect(getUttuError(error)).toBeNull();
    });
  });

  describe('getStyledUttuError', () => {
    const generalMessage = 'Failed to save line';
    const fallbackMessage = 'Please try again';

    it('should return formatted error with general message prefix', () => {
      const error = createUttuError('Line name must be unique');
      expect(getStyledUttuError(error, generalMessage)).toBe(
        'Failed to save line: Line name must be unique',
      );
    });

    it('should return general message with fallback when no error message', () => {
      const error = createUttuError();
      expect(getStyledUttuError(error, generalMessage, fallbackMessage)).toBe(
        'Failed to save line. Please try again',
      );
    });

    it('should return general message with empty fallback when no error message and no fallback', () => {
      const error = createUttuError();
      expect(getStyledUttuError(error, generalMessage)).toBe(
        'Failed to save line. ',
      );
    });
  });

  describe('getInternationalizedUttuError', () => {
    const mockIntl = createMockIntl();

    it('should return translated error for known error code', () => {
      const error = createUttuError(
        'Entity is referenced',
        UttuCode.ENTITY_IS_REFERENCED,
      );
      const result = getInternationalizedUttuError(mockIntl, error);
      expect(result).toBe('translated_uttuErrorENTITY_IS_REFERENCED');
    });

    it('should return translated error for combined code (code + subCode)', () => {
      const error = createUttuError(
        'Line name must be unique',
        UttuCode.CONSTRAINT_VIOLATION,
        UttuSubCode.LINE_UNIQUE_NAME,
      );
      const result = getInternationalizedUttuError(mockIntl, error);
      expect(result).toBe(
        'translated_uttuErrorCONSTRAINT_VIOLATION_LINE_UNIQUE_NAME',
      );
    });

    it('should return unknown error message when no extensions', () => {
      const error: UttuError = {
        name: 'UttuError',
        message: 'Error',
        response: { errors: [{ message: 'Some error' }] },
      };
      const result = getInternationalizedUttuError(mockIntl, error);
      expect(result).toBe('translated_uttuErrorUNKNOWN');
    });

    it('should return unknown error message when response is undefined', () => {
      const error: UttuError = {
        name: 'UttuError',
        message: 'Error',
        response: undefined,
      };
      const result = getInternationalizedUttuError(mockIntl, error);
      expect(result).toBe('translated_uttuErrorUNKNOWN');
    });

    it('should handle CombinedGraphQLErrors', () => {
      // Create a mock error that passes CombinedGraphQLErrors.is() check
      const graphQLError = new CombinedGraphQLErrors({
        errors: [
          {
            message: 'GraphQL error',
            extensions: {
              code: UttuCode.MISSING_OPERATOR,
              subCode: undefined,
              metaData: {},
            },
          },
        ],
      } as any);

      const result = getInternationalizedUttuError(mockIntl, graphQLError);
      expect(result).toBe('translated_uttuErrorMISSING_OPERATOR');
    });

    it('should fall back to UNKNOWN for unmapped error codes', () => {
      const error = createUttuError('Some error', 'UNMAPPED_CODE' as UttuCode);
      const result = getInternationalizedUttuError(mockIntl, error);
      expect(result).toBe('translated_uttuErrorUNKNOWN');
    });
  });
});
