import { isAdmin } from './tokenParser';

describe('tokenParser.isAdmin', () => {
  it('should return true when the token grants access', () => {
    expect(isAdmin({ realm_access: { roles: ['admin'] } })).toBeTruthy();
  });

  it('should return false when the user is not admin', () => {
    expect(isAdmin(undefined)).toBeFalsy();
    expect(isAdmin({ realm_access: undefined })).toBeFalsy();
    expect(isAdmin({ realm_access: { roles: [] } })).toBeFalsy();
    expect(isAdmin({ realm_access: { roles: ['user'] } })).toBeFalsy();
  });
});
