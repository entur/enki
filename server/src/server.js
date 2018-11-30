const path = require('path');
const express = require('express');

const { configureApp } = require('./server-config');
const { appLog, infoLevel } = require('./log');
const port = process.env.APP_PORT || 3001;
const contentRoot = path.resolve(process.env.CONTENT_BASE || '../../build');

const dryRun = process.env.DRY_RUN;
const mountPath = process.env.PUBLIC_URL;

const app = configureApp(express(), mountPath);

if (dryRun !== 'dry') {
  const server = app.listen(port, () => {
    appLog(
      infoLevel,
      `OrderTransport UI server running on port: ${server.address().port}`
    );
    appLog(infoLevel, `Mount path: ${mountPath}`);
    appLog(infoLevel, `Serving content from: ${contentRoot}`);
  });
}
