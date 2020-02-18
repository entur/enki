import { isBlank, objectIsEmpty } from './forms';

describe('forms', () => {
  describe('isBlank', () => {
    it('should return true for empty string', () => {
      expect(isBlank('')).toBeTruthy();
      expect(isBlank('   ')).toBeTruthy();
    });

    it('should return false for non empty string', () => {
      expect(isBlank('Hello')).toBeFalsy();
      expect(isBlank('undefined')).toBeFalsy();
    });
  });

  describe('objectIsEmpty', () => {
    it('should return true if object is empty', () => {
      expect(objectIsEmpty({})).toBeTruthy();
      expect(objectIsEmpty([])).toBeTruthy();
      expect(objectIsEmpty('')).toBeTruthy();
    });

    it('should return false if object is not empty', () => {
      expect(objectIsEmpty({ a: 1, b: 2, c: { d: 3 } })).toBeFalsy();
      expect(objectIsEmpty([1, 2, 3])).toBeFalsy();
      expect(objectIsEmpty('abc')).toBeFalsy();
    });
  });
});
