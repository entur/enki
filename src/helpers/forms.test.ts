import { isBlank, objectValuesAreEmpty } from './forms';

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
      expect(objectValuesAreEmpty({})).toBeTruthy();
      expect(objectValuesAreEmpty([])).toBeTruthy();
      expect(objectValuesAreEmpty({ name: [] })).toBeTruthy();
      expect(
        objectValuesAreEmpty({ name: undefined, age: undefined })
      ).toBeTruthy();
      expect(
        objectValuesAreEmpty([
          {
            name: undefined,
            flexibleArea: undefined,
          },
        ])
      ).toBeTruthy();
    });

    it('should return false if object is not empty', () => {
      expect(objectValuesAreEmpty({ a: 1, b: 2, c: { d: 3 } })).toBeFalsy();
      expect(objectValuesAreEmpty([1, 2, 3])).toBeFalsy();
      expect(
        objectValuesAreEmpty({
          a: ['a1', 'a2'],
          b: ['b1', 'b2'],
        })
      ).toBeFalsy();
    });
  });
});
