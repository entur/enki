import { useConfig } from 'config/ConfigContext';
import { OidcClientSettings, User as OidcUser } from 'oidc-client-ts';
import React, { useEffect } from 'react';
import {
  AuthProvider as OidcAuthProvider,
  hasAuthParams,
  useAuth as useOidcAuth,
} from 'react-oidc-context';

export interface Auth<T extends User> {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: T | null;
  roleAssignments?: string[] | null;
  getAccessToken: () => Promise<string>;
  logout: ({ returnTo }: { returnTo?: string }) => Promise<void>;
  login: (redirectUri?: string) => Promise<void>;
}

export interface User {
  name?: string;
}

const catchAndThrow = (err: any) => {
  throw err;
};

export const useAuth = (): Auth<User> => {
  const {
    isLoading,
    isAuthenticated,
    activeNavigator,
    user,
    signoutRedirect,
    signinRedirect,
  } = useOidcAuth();

  const { claimsNamespace, preferredNameNamespace } = useConfig();

  useEffect(() => {
    if (
      !hasAuthParams() &&
      !isAuthenticated &&
      !activeNavigator &&
      !isLoading
    ) {
      signinRedirect().catch(catchAndThrow);
    }
  }, [isAuthenticated, activeNavigator, isLoading, signinRedirect]);

  return {
    isLoading,
    isAuthenticated,
    user: {
      name: user?.profile[preferredNameNamespace!] as string,
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
  oidcConfig?: OidcClientSettings;
};

export const AuthProvider: React.FC<Props> = ({ children, oidcConfig }) => (
  <OidcAuthProvider
    {...oidcConfig!}
    onSigninCallback={(_user: OidcUser | void): void => {
      window.history.replaceState({}, document.title, window.location.pathname);
    }}
    redirect_uri={window.location.origin}
  >
    {children}
  </OidcAuthProvider>
);
