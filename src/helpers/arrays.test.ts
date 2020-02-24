import { removeElementByIndex, replaceElement } from './arrays';

describe('arrays', () => {
  describe('replaceElement', () => {
    it('should replace an element in the given position', () => {
      expect(
        replaceElement(['old value', 'second value'], 0, 'new value')
      ).toEqual(['new value', 'second value']);
    });

    it('should add element if the index is out of range', () => {
      expect(
        replaceElement(['old value', 'second value'], 10, 'third value')
      ).toEqual(['old value', 'second value', 'third value']);
    });
  });

  describe('removeElementByIndex', () => {
    it('should remove element in given position', () => {
      expect(
        removeElementByIndex(['first value', 'remove me', 'other value'], 1)
      ).toEqual(['first value', 'other value']);
    });

    it('should do nothing if index does not exist', () => {
      expect(removeElementByIndex(['first value', 'other value'], 10)).toEqual([
        'first value',
        'other value'
      ]);
    });
  });
});
