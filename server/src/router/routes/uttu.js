const { POST, OPTION } = require('../index');
const { forwardingProxy } = require('../../forwardingproxy');

const router = require('express').Router();
const apiUrl =
  process.env.UTTU_API_URL || 'https://entur.io/uttu_url_configuration_missing';
const proxy = forwardingProxy(apiUrl);

console.log(`UTTU proxy forwarding to ${apiUrl}`);

router.use(
  '/uttu/providers',
  proxy([OPTION, POST], () => '/providers/graphql')
);

router.use(
  '/uttu/:provider',
  proxy([OPTION, POST], req => `/${req.params.provider}/graphql`)
);

module.exports = router;
