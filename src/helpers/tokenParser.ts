import { KeycloakTokenParsed } from 'keycloak-js';

export const isAdmin = (token: KeycloakTokenParsed | undefined) =>
  token?.realm_access?.roles.includes('admin') ?? false;
