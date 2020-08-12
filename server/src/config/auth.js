const authURL = process.env.AUTH_SERVER_URL || 'https://kc-dev.devstage.entur.io/auth';
const authClientId = process.env.AUTH_CLIENT_ID || 'flexible-transport-frontend';
const openIDConnectUrl = authURL + '/realms/rutebanken/protocol/openid-connect/token';

module.exports = {
  authURL,
  authClientId,
  openIDConnectUrl
};
