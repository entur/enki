export const copyObj = (object, extraFields = {}) => {
  return Object.assign(Object.create(object), object, extraFields);
};
