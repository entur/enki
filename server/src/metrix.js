const client = require('prom-client');

const withMetrix = app => {
  const collectDefaultMetrics = client.collectDefaultMetrics;
  collectDefaultMetrics();

  const counter = new client.Counter({
    name: 'http_request',
    help: 'Number of http requests grouped by response code.',
    labelNames: ['code']
  });

  return app
    .use((req, res, next) => {
      if (res.statusCode >= 100 && res.statusCode < 600) {
        const xxx = Math.floor(res.statusCode / 100);
        counter.inc({ code: `${xxx}xx` });
      }
      next();
    })
    .get('/metrics', (req, res) => {
      res.type('text/plain');
      res.send(client.register.metrics());
    });
};

module.exports = { withMetrix };
