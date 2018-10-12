import { GraphQLClient } from 'graphql-request';

import { API_BASE } from '../http/http';

const headers = { 'et-client-name': 'OT' };

export const UttuQuery = (provider, query, variables) => {
  const endpoint = API_BASE + '/uttu/' + provider;
  const client = new GraphQLClient(endpoint, { headers });
  return client.request(query, variables);
};
