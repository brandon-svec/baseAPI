// External Imports
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// Internal Imports

// Routes

const ping = require(path.resolve('api/routes/ping.js'));

// Express

function GetWebServerConfig () {
  const app = express();

  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(require(path.resolve('api/middleware/primeRequest.js')));
  app.use(require(path.resolve('api/middleware/handleTimeout.js')));
  app.use(require(path.resolve('api/middleware/writeLog.js')));
  app.use(require(path.resolve('api/middleware/handleResponse.js')));

  app.get('/', require(path.resolve('api/routes/healthCheck.js')));

  app.post('*', require(path.resolve('api/middleware/handleContentType.js')));

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
