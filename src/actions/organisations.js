import http from '../http/http';

export const RECEIVE_ORGANISATIONS = 'RECEIVE_ORGANISATIONS';

const receiveOrganisations = organisations => ({
  type: RECEIVE_ORGANISATIONS,
  organisations
});

export const getOrganisations = () => dispatch => {
  return http.get('/organisations').then(response => {
    dispatch(receiveOrganisations(response.data));
    return Promise.resolve(response.data);
  });
};
