const { POST, OPTION } = require('../index');
const { forwardingProxy } = require('../../forwardingproxy');

const router = require('express').Router();
const apiUrl = require('../../config/app').stopPlacesApiUrl;
const proxy = forwardingProxy(apiUrl);

console.log(`stopPlaces proxy forwarding to ${apiUrl}`);

router.use(
  '/stopPlaces',
  proxy([OPTION, POST], (req) => '')
);

module.exports = router;