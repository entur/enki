export const getUttuError = e => {
  return e.response &&
    e.response.errors &&
    e.response.errors.length > 0 &&
    e.response.errors[0].message
    ? e.response.errors[0].message
    : null;
};
