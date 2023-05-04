import { useConfig } from 'config/ConfigContext';
import { User as OidcUser } from 'oidc-client-ts';
import React, { useEffect } from 'react';
import {
  AuthProvider,
  AuthProviderProps,
  hasAuthParams,
  useAuth as useOidcAuth,
} from 'react-oidc-context';

export interface Auth<T extends User> {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: T | null;
  roleAssignments?: string[] | null;
  getAccessToken: () => Promise<string>;
  logout: ({ returnTo }: { returnTo?: string }) => void;
  login: (redirectUri?: string) => void;
}

export interface User {
  name?: string;
}

export const useAuth = (): Auth<User> => {
  const {
    isLoading,
    isAuthenticated,
    activeNavigator,
    user,
    signoutRedirect,
    signinRedirect,
  } = useOidcAuth();

  const { claimsNamespace } = useConfig();

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !isAuthenticated &&
      !activeNavigator &&
      !isLoading
    ) {
      signinRedirect();
    }
  }, [isAuthenticated, activeNavigator, isLoading, signinRedirect]);

  return {
    isLoading,
    isAuthenticated,
    user: {
      name: user?.profile['https://ror.entur.io/preferred_name'] as string, // TODO: make this configurable
    },
    getAccessToken: () => {
      return new Promise<string>((resolve, reject) => {
        const accessToken = user?.access_token;
        if (accessToken) {
          resolve(accessToken);
        } else {
          reject();
        }
      });
    },
    logout: ({ returnTo }) =>
      signoutRedirect({ post_logout_redirect_uri: returnTo }),
    login: (redirectUri?: string) =>
      signinRedirect({ redirect_uri: redirectUri }),
    roleAssignments: user?.profile[claimsNamespace!] as string[],
  };
};

type Props = {
  children: React.ReactNode;
  oidcConfig: AuthProviderProps;
};

export const EnturAuthProvider: React.FC<Props> = ({
  children,
  oidcConfig,
}) => (
  <AuthProvider
    onSigninCallback={(_user: OidcUser | void): void => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }}
    {...oidcConfig}
  >
    {children}
  </AuthProvider>
);
