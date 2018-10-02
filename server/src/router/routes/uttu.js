const { POST, OPTION } = require('../index');
const { forwardingProxy } = require('../../forwardingproxy');

const router = require('express').Router();
const apiUrl = process.env.UTTU_API_URL || 'https://entur.io/uttu_url_configuration_missing';
const proxy = forwardingProxy(apiUrl);

console.log(`UTTU proxy forwarding to ${apiUrl}`);

router.use('/uttu', proxy([OPTION, POST], () => '/graphql'));

module.exports = router;
