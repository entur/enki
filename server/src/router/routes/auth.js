const router = require('express').Router();
const auth0Config = require('../../config/auth0');

router.get('/auth0.json', (req, res) => {
  res.json(auth0Config);
});

module.exports = router;
