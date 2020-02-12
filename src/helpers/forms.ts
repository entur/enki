export const isBlank = (val: string) => !val || val.trim() === '';
export const hasValue = (val: string) => !isBlank(val);

export const objectValues = <E>(obj: E) => Object.values(obj).flat();
