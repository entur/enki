import { GraphQLClient, Variables } from 'graphql-request';

import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Auth, useAuth } from 'auth/auth';
import { useConfig } from 'config/ConfigContext';
import { ReactElement } from 'react';
import { useAppSelector } from '../store/hooks';
import { VEHICLE_MODE } from '../model/enums';

export const staticHeaders = { 'ET-Client-Name': 'Entur - Flex editor' };

export type SearchForQuayResponse = {
  stopPlace: null | StopPlace[];
};

export type Quay = {
  id: string;
  publicCode: null | string;
  name: null | { value: string };
  centroid: Centroid;
};

export type Centroid = {
  location: Location;
};

export type Location = {
  longitude: number;
  latitude: number;
};

export type StopPlace = {
  id: string;
  name: { value: string };
  transportMode?: VEHICLE_MODE;
  centroid?: Centroid;
  quays: Quay[];
  children: StopPlace[];
};

export const UttuQuery = (
  apiBase: string | undefined,
  provider: string,
  query: string,
  variables?: Variables,
  accessToken?: string,
) => {
  const endpoint = (apiBase || '') + '/' + provider + '/graphql';

  const client = new GraphQLClient(endpoint, {
    headers: { ...staticHeaders, authorization: `Bearer ${accessToken}` },
  });

  return client.request(query, variables) as Promise<any>;
};

const cleanTypeName = new ApolloLink((operation, forward) => {
  if (operation.variables) {
    const omitTypename = (key: string, value: any) =>
      key === '__typename' ? undefined : value;
    operation.variables = JSON.parse(
      JSON.stringify(operation.variables),
      omitTypename,
    );
  }
  return forward(operation).map((data) => {
    return data;
  });
});

const apolloClient = (apiBase: string, provider: string, auth: Auth) => {
  const httpLink = createHttpLink({
    uri: apiBase + '/' + provider + '/graphql',
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
  const provider = useAppSelector(
    (state) => state.userContext.activeProviderCode,
  );

  const auth = useAuth();

  const { uttuApiUrl } = useConfig();

  return (
    <ApolloProvider client={apolloClient(uttuApiUrl!, provider!, auth)}>
      {children}
    </ApolloProvider>
  );
};
