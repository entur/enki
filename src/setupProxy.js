const configureApp = require('../server/src/server-config').configureApp;

module.exports = function(app) {
  configureApp(app);
};
