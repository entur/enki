const expressRouter = require('express').Router;
const endpointBase = '/api';

const GET = 'GET';
const PUT = 'PUT';
const POST = 'POST';
const DELETE = 'DELETE';
const PATCH = 'PATCH';
const OPTION = 'OPTION';

const createRouter = () => {
  const router = expressRouter();
  ['auth', 'organisations', 'uttu'].forEach(
    (route) => router.use(require(`./routes/${route}`))
  );
  return router;
};

module.exports = {
  createRouter,
  endpointBase,
  GET,
  PUT,
  POST,
  DELETE,
  PATCH,
  OPTION,
};
