'use strict';

let loopback = require('loopback');
let boot = require('loopback-boot');

const logger = require('../common/lib/logger');

let app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    let baseUrl = app.get('url').replace(/\/$/, '');
    logger.info('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      let explorerPath = app.get('loopback-component-explorer').mountPath;
      logger.info('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Disable bearerTokenBaseenabled64Encoded for enable jwt authentication
app.use(loopback.token({
  model: app.models.accessToken,
  currentUserLiteral: 'me',
  bearerTokenBase64Encoded: false // here
}));

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
