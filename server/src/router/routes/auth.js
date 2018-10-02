const router = require('express').Router();
const authURL = require('../../config/auth').authURL;

router.get('/keycloak.json', (req, res) =>
  res.json({
    realm: 'partner',
    'auth-server-url': authURL,
    'ssl-required': 'external',
    resource: 'order-transport',
    'public-client': true
  })
);

module.exports = router;
