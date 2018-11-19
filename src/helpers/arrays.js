export const replaceElement = (array, index, value) => {
  return [...array.slice(0, index), value, ...array.slice(index + 1)];
};

export const removeElementByIndex = (array, index) => {
  return [...array.slice(0, index), ...array.slice(index + 1)];
};
