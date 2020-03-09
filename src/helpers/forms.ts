export const isBlank = (val: string | undefined): boolean =>
  !val || val.trim() === '';

export const isNumeric = (val: string): boolean => /^\d+$/.test(val);

export const objectValuesAreEmpty = (obj: object): boolean =>
  Object.values(obj)
    .reduce((acc, curr) => acc.concat(curr), [])
    .filter((el: any) => el !== undefined).length === 0;
