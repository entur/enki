const authURL = process.env.AUTH_SERVER_URL || 'https://www-test.entur.org/auth';
const openIDConnectUrl = authURL + '/realms/rutebanken/protocol/openid-connect/token';

module.exports = {
  authURL,
  openIDConnectUrl
};