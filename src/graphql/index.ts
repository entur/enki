import { GraphQLClient } from 'graphql-request';

import { API_BASE } from 'http/http';
import token from 'http/token';
import { Variables } from 'graphql-request/dist/src/types';

const staticHeaders = { 'ET-Client-Name': 'Entur - Flex editor' };

export const UttuQuery = (
  provider: string,
  query: string,
  variables?: Variables
) => {
  const endpoint = API_BASE + '/uttu/' + provider;
  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders, authorization: token.getBearer() },
  });
  return client.request(query, variables);
};

export const StopPlacesQuery = (
  endpoint: string,
  query: string,
  variables?: Variables
) => {
  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders },
  });
  return client.request(query, variables);
};
