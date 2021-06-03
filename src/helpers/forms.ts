import * as R from 'ramda';

export const isBlank = (val: string | undefined | null): boolean =>
  !val || val.trim() === '';

export const isNumeric = (val: string): boolean => /^\d+$/.test(val);

export const objectValuesAreEmpty = (obj: object): boolean =>
  !Object.values(obj).some((x) => x && !R.isEmpty(x));
