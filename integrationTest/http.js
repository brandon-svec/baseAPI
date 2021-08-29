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
  client = mockServer(app);
  setImmediate(cb);
}

before(fn_init);

describe('HTTP Routes', function () {
  describe('MakeCall', function () {
    it('Makes a call to github', function (done) {
      client
        .get('/makeCall/www.google.com')
        .expect(200)
        .end(function (err, res) {
          assert.isNull(err);
          assert.isNotNull(res.text);
          assert.isTrue(res.text.startsWith('<!doctype html><html itemscope="" itemtype="http://schema.org/WebPage" lang="en"><head><meta content="Search the world'));
          done();
        });
    });
  });
});
