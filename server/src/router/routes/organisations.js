const { GET } = require('../index');
const { forwardingProxy } = require('../../forwardingproxy');

const router = require('express').Router();

const apiUrl = process.env.ORGANISATIONS_API_URL || 'http://localhost:9002';
const proxy = forwardingProxy(apiUrl);
console.log(`Organisations proxy forwarding to ${apiUrl}`);

router.use('/organisations', proxy([GET], () => '/organisations'));

module.exports = router;
