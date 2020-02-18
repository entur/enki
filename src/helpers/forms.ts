export const isBlank = (val: string | undefined): boolean =>
  !val || val.trim() === '';

export const objectIsEmpty = <E>(obj: E): boolean =>
  Object.values(obj).flat().length === 0;
