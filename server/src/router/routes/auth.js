const router = require('express').Router();
const authURL = require('../../config/auth').authURL;

router.get('/keycloak.json', (req, res) =>
  res.json({
    realm: 'rutebanken',
    'auth-server-url': authURL,
    'ssl-required': 'external',
    resource: 'flexible-transport-frontend',
    'public-client': true
  })
);

module.exports = router;
