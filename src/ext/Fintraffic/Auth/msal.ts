import {
  Configuration,
  EventMessage,
  EventType,
  IPublicClientApplication,
  PublicClientApplication,
  RedirectRequest,
} from '@azure/msal-browser';
import { useCallback, useEffect, useState } from 'react';
import { Auth } from '../../../auth/auth';

const createAccountRequest = (clientId: string): RedirectRequest => {
  return {
    scopes: [`api://${clientId}/URA.App`],
    prompt: 'create',
  };
};

export const createAccount = (
  msalInstance: IPublicClientApplication,
  msalConfig: Configuration,
) => {
  msalInstance
    .loginRedirect(createAccountRequest(msalConfig.auth.clientId))
    .catch((error) => {
      console.error('Account creation error', error);
    });
};

export const useMsalProvider = (
  msalConfig: Configuration | undefined,
  oidcAuthProvider: Auth,
) => {
  const [msalInstance, setMsalInstance] = useState<IPublicClientApplication>();

  const initializeMsal = useCallback(async () => {
    if (!msalConfig) {
      return;
    }
    const pca: IPublicClientApplication =
      await PublicClientApplication.createPublicClientApplication(msalConfig);
    pca.addEventCallback((event: EventMessage) => {
      if (event.eventType === EventType.LOGIN_SUCCESS) {
        oidcAuthProvider.login(msalConfig.auth.redirectUri);
      }
    });
    setMsalInstance(pca);
  }, []);

  useEffect(() => {
    if (!msalInstance && msalConfig) {
      initializeMsal().catch((error) =>
        console.error(
          'Error while initializing PublicClientApplication',
          error,
        ),
      );
    }
  }, [msalInstance, msalConfig]);

  return {
    msalInstance,
  };
};
