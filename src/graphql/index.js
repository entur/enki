import { GraphQLClient } from 'graphql-request';

import { API_BASE } from 'http/http';
import token from 'http/token';

const staticHeaders = { 'ET-Client-Name': 'Entur - Flex editor' };

export const UttuQuery = (provider, query, variables) => {
  const endpoint = API_BASE + '/uttu/' + provider;
  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders, authorization: token.getBearer() },
  });
  return client.request(query, variables);
};

export const StopPlacesQuery = (endpoint, query, variables) => {
  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders },
  });
  return client.request(query, variables);
};
