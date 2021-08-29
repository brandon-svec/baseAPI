// External Imports
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Internal Imports

// Routes

const req_prime = require('../api/middleware/req_prime');
const healthcheck = require('../api/routes/healthcheck');
const handleContentType = require('../api/middleware/handleContentType');

const ping = require(path.resolve('api', 'routes', 'ping.js'));

// Express

function GetWebServerConfig (_config, _log) {
  var app = express();

  app.locals['config'] = _config;
  app.locals['log'] = _log;

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(req_prime.run);

  app.get('/', healthcheck);

  app.post('*', handleContentType.run);

  app.post('*', bodyParser.json({
    limit: '1mb'
  }));

  // Routes

  app.get('/ping', ping.Ping);
  app.post('/mirror', ping.Mirror);
  app.get('/makeCall/:foo', ping.MakeCall);

  return app;
}

// Internal

// Exports

module.exports = {
  GetWebServerConfig
};
