process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_DIR = './config/';

const request = require('supertest');
const assert = require('chai').assert;
const async = require('async');
const pino = require('pino');
const config = require('config');

const webServerConfig = require('../lib/webserver');

const log = pino(config.get('logging'));

var app = webServerConfig.GetWebServerConfig(config, log);

var client = null;

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
  client = request(app);
  setImmediate(cb);
}

before(fn_init);

describe('Happy Path', function () {
  it('Responds to healtcheck', function (done) {
    client
      .get('/')
      .expect(200, done);
  });
});
