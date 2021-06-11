const { GET, OPTION } = require('../index');
const { forwardingProxy } = require('../../forwardingproxy');

const router = require('express').Router();
const apiUrl = require('../../config/app').stopPlacesReadApiUrl;
const proxy = forwardingProxy(apiUrl);

console.log(`stopPlacesRead proxy forwarding to ${apiUrl}`);

router.use(
  '/stopPlacesRead/quays/:quayId/stop-place',
  proxy([OPTION, GET], (req) => `/quays/${req.params.quayId}/stop-place`)
);


module.exports = router;
