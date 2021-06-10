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

export const staticHeaders = { 'ET-Client-Name': 'Entur - Flex editor' };

export type SearchForQuayResponse = {
  stopPlace: null | StopPlace[];
};

export type Quay = {
  id: string;
  publicCode: null | string;
  name: null | string;
};

export type StopPlace = {
  id: string;
  name: { value: string };
  quays: Quay[];
  children: StopPlace[];
};

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
  return client.request(query, variables) as Promise<any>;
};

export const StopPlacesRead = async (endpoint: string) => {
  const response = await fetch(endpoint, {
    headers: { ...staticHeaders },
  });

  return response.json();
};

export const StopPlacesQuery = async (
  endpoint: string,
  query: string,
  variables?: Variables
) => {
  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders },
  });
  const response = await client.request(query, variables);
  return response as null | SearchForQuayResponse;
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
