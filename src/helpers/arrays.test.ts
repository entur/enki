import {
  addOrRemove,
  changeElementAtIndex,
  removeElementByIndex,
  replaceElement,
} from './arrays';

describe('arrays', () => {
  describe('replaceElement', () => {
    it('should replace an element in the given position', () => {
      expect(
        replaceElement(['old value', 'second value'], 0, 'new value'),
      ).toEqual(['new value', 'second value']);
    });

    it('should add element if the index is out of range', () => {
      expect(
        replaceElement(['old value', 'second value'], 10, 'third value'),
      ).toEqual(['old value', 'second value', 'third value']);
    });
  });

  describe('removeElementByIndex', () => {
    it('should remove element in given position', () => {
      expect(
        removeElementByIndex(['first value', 'remove me', 'other value'], 1),
      ).toEqual(['first value', 'other value']);
    });

    it('should do nothing if index does not exist', () => {
      expect(removeElementByIndex(['first value', 'other value'], 10)).toEqual([
        'first value',
        'other value',
      ]);
    });
  });

  describe('addToListIfNotExistsOtherwiseRemove', () => {
    it('should remove element if it exists in list', () => {
      expect(
        addOrRemove('remove me', ['first value', 'remove me', 'other value']),
      ).toEqual(['first value', 'other value']);
    });

    it('should add element if it does not exist in the list', () => {
      expect(addOrRemove('add me', ['first value', 'other value'])).toEqual([
        'first value',
        'other value',
        'add me',
      ]);
    });
  });

  describe('changeElementAtIndex', () => {
    it('should replace an element in the given position', () => {
      expect(
        changeElementAtIndex(['old value', 'second value'], 'new value', 0),
      ).toEqual(['new value', 'second value']);
    });

    it('should do nothing if the index is out of range', () => {
      expect(
        changeElementAtIndex(['old value', 'second value'], 'new value', 10),
      ).toEqual(['old value', 'second value']);
    });
  });
});
