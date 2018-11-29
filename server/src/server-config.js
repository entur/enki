const fallback = require('express-history-api-fallback');
const path = require('path');
const express = require('express');
const compression = require('compression');
const { withSecurity } = require('./security-middleware');
const { createRouter, endpointBase } = require('./router/');
const { appLog, errorLevel } = require('./log');
const contentRoot = path.resolve(process.env.CONTENT_BASE || '../../build');
const { withMetrix } = require('./metrix');

const publicUrl = process.env.PUBLIC_URL;

const configureApp = app =>
  withSecurity(withMetrix(app))
    .get(publicUrl + '/health', (req, res) => res.json({ status: 'UP' }))
    .get(publicUrl + '/info', (req, res) =>
      res.json({
        name: 'order-transport',
        environment: process.env.ENVIRONMENT,
        version: process.env.IMAGE_TAG ? process.env.IMAGE_TAG : 'N/A',
        buildDate: process.env.BUILD_DATE
      })
    )
    .use(compression())
    .use(publicUrl + '/', express.static(contentRoot))
    .use(publicUrl + '/' + endpointBase, createRouter())
    .use(fallback('index.html', { root: contentRoot }))
    .use((err, req, res, next) => {
      appLog(errorLevel, `Request to ${req.url} failed: ${err.stack}`);
      next(err);
    })
    // eslint-disable-next-line no-unused-vars
    .use((err, req, res, next) => {
      res.status(500);
      res.send({
        code: 'INTERNAL_ERROR',
        message: 'Ooops. Something broke back here. Sorry!'
      });
    });

module.exports = { configureApp };
