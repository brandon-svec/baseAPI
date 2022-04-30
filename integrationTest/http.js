process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_DIR = './config/';

const assert = require('chai').assert;
const async = require('async');
const config = require('config');
const path = require('path');
const pino = require('pino');
const mockServer = require('supertest');

const webServerConfig = require(path.resolve('lib', 'webserver.js'));

const log = pino(config.get('logging'));

const app = webServerConfig.GetWebServerConfig(config, log);

let client = null;

function init () {
  log.info('Starting Service...');

  async.waterfall([
    initHTTPserver
  ],
  function (err, result) {
    if (err) {
      log.error('Service Failed to Start');
    } else {
      log.info('Service Started');
    }
  });
}

function initHTTPserver (cb) {
  client = mockServer(app);
  setImmediate(cb);
}

describe('HTTP Routes', function () {
  before(init);

  describe('MakeCall', function () {
    it('Makes a call to github', function (done) {
      client
        .get('/makeCall/www.google.com')
        .expect(200)
        .end(function (err, res) {
          assert.isNull(err);
          assert.isObject(res.body);
          assert.isTrue(res.body.data.startsWith('<!doctype html><html itemscope="" itemtype="http://schema.org/WebPage" lang="en"><head><meta content="Search the world'));
          done();
        });
    });
  });
});
