const authURL = process.env.AUTH_SERVER_URL || 'https://kc-dev.devstage.entur.io/auth';
const openIDConnectUrl = authURL + '/realms/rutebanken/protocol/openid-connect/token';

module.exports = {
  authURL,
  openIDConnectUrl
};