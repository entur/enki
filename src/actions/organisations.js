import http from '../http/http';

export const ENTUR_ORGANISATION_ID = '1';

export const RECEIVE_ORGANISATIONS = 'RECEIVE_ORGANISATIONS';

export const SET_ACTIVE_ORGANISATION = 'SET_ACTIVE_ORGANISATION';

const receiveOrganisations = organisations => ({
  type: RECEIVE_ORGANISATIONS,
  organisations
});

export const setActiveOrganisationById = organisationId => ({
  type: SET_ACTIVE_ORGANISATION,
  organisation: organisationId
});

export const getOrganisations = () => dispatch => {
  return http.get('/organisations').then(response => {
    dispatch(receiveOrganisations(response.data));
    return Promise.resolve(response.data);
  });
};
