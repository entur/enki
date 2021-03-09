const router = require('express').Router();
const authURL = require('../../config/auth').authURL;
const authClientId = require('../../config/auth').authClientId;
const auth0Config = require('../../config/auth0');

router.get('/keycloak.json', (req, res) =>
  res.json({
    realm: 'rutebanken',
    'auth-server-url': authURL,
    'ssl-required': 'external',
    resource: authClientId,
    'public-client': true,
  })
);

module.exports = router;
