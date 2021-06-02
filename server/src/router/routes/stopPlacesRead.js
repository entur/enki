const { GET, OPTION } = require('../index');
const { forwardingProxy } = require('../../forwardingproxy');

const router = require('express').Router();
const apiUrl = 'https://api.entur.io/stop-places/v1/read';
const proxy = forwardingProxy(apiUrl);

console.log(`stopPlacesRead proxy forwarding to ${apiUrl}`);

router.use(
  '/stopPlacesRead/quays/:quayId/stop-place',
  proxy([OPTION, GET], (req) => `/quays/${req.params.quayId}/stop-place`)
);


module.exports = router;
