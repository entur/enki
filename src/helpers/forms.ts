import isEmpty from 'lodash.isempty';

export const isBlank = (val: string | undefined | null): boolean =>
  !val || val.trim() === '';

export const isNumeric = (val: string): boolean => /^\d+$/.test(val);

export const objectValuesAreEmpty = (obj: object): boolean =>
  !Object.values(obj).some(objectValueIsEmpty);

const objectValueIsEmpty = (x: any): boolean =>
  (x && (Array.isArray(x) || typeof x === 'object') && !isEmpty(x)) ||
  isNumeric(x);
