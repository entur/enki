export const isBlank = (val: string | undefined): boolean =>
  !val || val.trim() === '';

export const objectValuesAreEmpty = (obj: object): boolean =>
  Object.values(obj).reduce((acc, curr) => acc.concat(curr), []).length === 0;
