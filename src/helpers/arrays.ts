export const replaceElement = <E>(array: E[], index: number, value: E): E[] => [
  ...array.slice(0, index),
  value,
  ...array.slice(index + 1)
];

export const removeElementByIndex = <E>(array: E[], index: number): E[] => [
  ...array.slice(0, index),
  ...array.slice(index + 1)
];
