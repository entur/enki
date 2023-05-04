import { useConfig } from 'config/ConfigContext';
import { useEffect } from 'react';
import { hasAuthParams, useAuth as useOidcAuth } from 'react-oidc-context';

export interface Auth {
  isLoading: boolean;
  isAuthenticated: boolean;
  user?: {
    name?: string;
  };
  roleAssignments?: string[] | null;
  getAccessToken: () => Promise<string>;
  logout: ({ returnTo }: { returnTo?: string }) => Promise<void>;
  login: (redirectUri?: string) => Promise<void>;
}

export const useAuth = (): Auth => {
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
      signinRedirect().catch((err: any) => {
        throw err;
      });
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
