// External Imports
const express = require('express');
const bodyParser = require('body-parser');

// Internal Imports

// Routes

const req_prime = require('../api/middleware/req_prime');
const healthcheck = require('../api/routes/healthcheck');
const handleContentType = require('../api/middleware/handleContentType');

// Express

function fn_external_getWebServerConfig (_config, _log) {
  var app = express();

  app.locals['config'] = _config;
  app.locals['log'] = _log;

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(req_prime.run);

  app.get('/', healthcheck.run);

  app.post('*', handleContentType.run);

  app.post('*', bodyParser.json({
    limit: '1mb'
  }));

  // Schemas

  return app;
}

// Internal

// Exports

module.exports = {
  GetWebServerConfig: fn_external_getWebServerConfig
};
