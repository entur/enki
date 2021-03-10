import React from 'react';
import { GraphQLClient } from 'graphql-request';

import {
  ApolloProvider,
  ApolloClient,
  createHttpLink,
  InMemoryCache,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

import { API_BASE } from 'http/http';
import { Variables } from 'graphql-request/dist/src/types';
import { useSelector } from 'react-redux';
import { ReactElement } from 'react';
import { GlobalState } from 'reducers';
import { useAuth } from '@entur/auth-provider';
import { AuthState } from 'reducers/auth';

const staticHeaders = { 'ET-Client-Name': 'Entur - Flex editor' };

export const UttuQuery = (
  provider: string,
  query: string,
  variables?: Variables,
  accessToken?: string
) => {
  const endpoint = API_BASE + '/uttu/' + provider;
  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders, authorization: `Bearer ${accessToken}` },
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

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key: string, value: any) =>
      key === '__typename' ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename
    );
  }
  return forward(operation).map((data) => {
    return data;
  });
});

const apolloClient = (provider: string, auth: AuthState) => {
  const httpLink = createHttpLink({
    uri: API_BASE + '/uttu/' + provider,
  });

  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...staticHeaders,
        authorization: `Bearer ${await auth.getAccessToken()}`,
      },
    };
  });

  return new ApolloClient({
    link: ApolloLink.from([cleanTypeName, authLink, httpLink]),
    cache: new InMemoryCache(),
  });
};

type ApolloProps = {
  children: ReactElement;
};

export const Apollo = ({ children }: ApolloProps) => {
  const provider = useSelector<GlobalState, string | undefined>(
    (state) => state.providers.active?.code
  );
  const auth = useAuth();

  return (
    <ApolloProvider client={apolloClient(provider!, auth)}>
      {children}
    </ApolloProvider>
  );
};
