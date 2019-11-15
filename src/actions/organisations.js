import http from 'http/http';

export const RECEIVE_ORGANISATIONS = 'RECEIVE_ORGANISATIONS';

const receiveOrganisations = organisations => ({
  type: RECEIVE_ORGANISATIONS,
  organisations
});

export const getOrganisations = types => dispatch => {
  let typesQuery = types
    ? '?types' + (Array.isArray(types) ? types.join(',') : types)
    : '';
  return http.get(`/organisations${typesQuery}`).then(response => {
    dispatch(receiveOrganisations(response.data));
    return Promise.resolve(response.data);
  });
};
