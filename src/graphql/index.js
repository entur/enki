import { GraphQLClient } from 'graphql-request';

import { API_BASE } from '../http/http';
import token from '../http/token';

const staticHeaders = { 'et-client-name': 'OT' };

export const UttuQuery = (provider, query, variables) => {
  const endpoint = API_BASE + '/uttu/' + provider;
  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders, authorization: token.getBearer() }
  });
  return client.request(query, variables);
};
