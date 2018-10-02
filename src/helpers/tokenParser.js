export const isAdmin = token => {
  if (!token) {
    return false;
  }

  const { realm_access } = token;

  if (realm_access && realm_access.roles && realm_access.roles.length) {
    return realm_access.roles.indexOf('admin') > -1;
  }

  return false;
};
