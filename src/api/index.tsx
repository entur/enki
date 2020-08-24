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
import token from 'http/token';
import { Variables } from 'graphql-request/dist/src/types';
import { useSelector } from 'react-redux';
import { ReactElement } from 'react';
import { GlobalState } from 'reducers';

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

const apolloClient = (provider: string) => {
  const httpLink = createHttpLink({
    uri: API_BASE + '/uttu/' + provider,
  });

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        ...staticHeaders,
        authorization: token ? `${token.getBearer()}` : '',
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
  return (
    <ApolloProvider client={apolloClient(provider!)}>{children}</ApolloProvider>
  );
};
