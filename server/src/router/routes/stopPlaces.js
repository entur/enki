const { POST, OPTION } = require('../index');
const { forwardingProxy } = require('../../forwardingproxy');

const router = require('express').Router();
const apiUrl = 'https://api.entur.io/stop-places/v1/graphql';
const proxy = forwardingProxy(apiUrl);

console.log(`stopPlaces proxy forwarding to ${apiUrl}`);

router.use(
  '/stopPlaces',
  proxy([OPTION, POST], (req) => '')
);

module.exports = router;