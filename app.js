// External
const http = require('http');
const https = require('https');
const pino = require('pino');
const fs = require('fs');
const async = require('async');
const config = require('config');

// Internal

const webServerConfig = require('./lib/webserver');

// Global

const log = pino(config.get('logging'));

// Express

var app = webServerConfig.GetWebServerConfig(config, log);

var server = null;

// Start

fn_init();

// Functions

function fn_init () {
  log.info('Starting Service...');

  async.waterfall([
    fn_init_HTTPserver
  ],
  function (err, result) {
    if (err) {
      log.error('Service Failed to Start');
    } else {
      log.info('Service Started');
    }
  });
}

function fn_init_HTTPserver (cb) {
  if (server) {
    server.close();
  }

  // SSL HTTP Server
  var sslOptions = null;
  if (config.get('ssl')) {
    sslOptions = {
      pfx: fs.readFileSync(config.get('ssl.pfx')),
      passphrase: config.get('ssl.passphrase')
    };
  }

  if (sslOptions) {
    server = https.createServer(sslOptions, app);
  } else {
    server = http.createServer(app);
  }

  server.listen(config.get('http.port'), config.get('http.server'), function (err) {
    if (err) {
      log.error({ Error: err }, 'HTTP Server Failure');
    } else {
      log.info('HTTP Server Success');
    }

    cb(err);
  });
  server.timeout = 0;
}
