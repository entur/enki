/* eslint-disable no-unused-vars */
const proxy = require('express-http-proxy');
const url = require('url');
const uuid = require('uuid');
const { requestLog, usernameFromHeader } = require('./log');

const correlationIdHeader = 'correlation-id';
const authorizationHeader = 'authorization';

const requireOAuth = req =>
  !req.headers.authorization || req.headers.authorization.startsWith('Bearer ');

const requestJsonBody = (bodyContent, contentType) =>
  contentType && contentType.includes('application/json')
    ? JSON.parse(bodyContent)
    : '';

const objFilter = (obj, predicate) =>
  obj
    ? Object.keys(obj)
        .filter(k => predicate(k))
        .reduce((res, key) => ((res[key] = obj[key]), res), {})
    : obj;

const filterSensitiveHeaders = headers =>
  objFilter(headers, k => k.toLowerCase() !== authorizationHeader);

const logRequest = (type, bodyContent, req) =>
  requestLog({
    origin: 'remote',
    type,
    correlationId: req.headers[correlationIdHeader],
    protocol: `HTTP/${req.httpVersion}`,
    forwardedIpAddress: req.headers['x-forwarded-ip'],
    method: req.method,
    path: req.originalUrl,
    headers: filterSensitiveHeaders(req.headers),
    body: requestJsonBody(bodyContent, req.headers['content-type']),
    username: usernameFromHeader(req.headers['authorization'])
  });

const droppedHeaders = [
  'access-control-allow-credentials',
  'access-control-allow-headers',
  'access-control-allow-origin',
  'access-control-allow-methods',
  'accept-language'
];

const uploadLimitMb = process.env.UPLOAD_LIMIT_MB || 200;

const proxyConfig = (
  method,
  proxyReqPathResolver,
  additionalHeaders = () => {}
) => {
  const httpMethods = Array.isArray(method) ? method : [method];
  if (typeof proxyReqPathResolver !== 'function') {
    throw Error('proxyReqPathResolver is not a function!');
  }

  const filterAllowedHeaders = headers =>
    objFilter(headers, h => !droppedHeaders.includes(h));

  return {
    // filter: req => httpMethods.includes(req.method) && requireOAuth(req),
    proxyReqPathResolver,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = Object.assign(
        {},
        filterAllowedHeaders(proxyReqOpts.headers),
        additionalHeaders(srcReq.headers),
        {
          [correlationIdHeader]:
            proxyReqOpts.headers[correlationIdHeader] || uuid.v4()
        }
      );
      return proxyReqOpts;
    },
    proxyReqBodyDecorator: (bodyContent, srcReq) => {
      logRequest('request', bodyContent, srcReq);
      return bodyContent;
    },
    // eslint-disable-next-line no-unused-vars
    userResHeaderDecorator: (headers, userReq, userRes, proxyReq, proxyRes) => {
      return filterAllowedHeaders(headers);
    },
    limit: `${uploadLimitMb}mb`
  };
};

const stripTrailingSlash = url =>
  url.endsWith('/') ? url.substring(0, url.length - 1) : url;

// forwards a call of a specific url / set of methods to a remote server
const forwardingProxy = apiUrl => (method, forwardPath) =>
  proxy(
    apiUrl,
    proxyConfig(
      method,
      (...params) =>
        stripTrailingSlash(url.parse(apiUrl).path) + forwardPath(...params)
    )
  );

const urlQuery = obj => {
  const params = Object.keys(obj)
    .filter(k => obj[k] !== undefined)
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(obj[k])}`)
    .join('&');
  return params ? `?${params}` : '';
};

module.exports = { forwardingProxy, urlQuery };
