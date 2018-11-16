import { GraphQLClient } from 'graphql-request';

import { API_BASE } from '../http/http';
import token from '../http/token';

const headers = {
  'et-client-name': 'OT',
  authorization: token.getBearer()
};

export const UttuQuery = (provider, query, variables) => {
  const endpoint = API_BASE + '/uttu/' + provider;
  const client = new GraphQLClient(endpoint, { headers });
  return client.request(query, variables);
};
