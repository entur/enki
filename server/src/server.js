const path = require('path');
const express = require('express');

const configureApp = require('./server-config');
const { appLog, infoLevel } = require('./log');
const port = process.env.APP_PORT || 9000;
const contentRoot = path.resolve(process.env.CONTENT_BASE || '../../build');

const dryRun = process.env.DRY_RUN;
const app = configureApp(express());

if (dryRun !== 'dry') {
  const server = app.listen(port, () => {
    appLog(
      infoLevel,
      `OrderTransport UI server running on port: ${server.address().port}`
    );
    appLog(infoLevel, `Serving content from: ${contentRoot}`);
  });
}
