process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_DIR = './config/';

const assert = require('chai').assert;
const async = require('async');
const config = require('config');
const mockServer = require('supertest');
const path = require('path');
const pino = require('pino');
const sinon = require('sinon');

const webServerConfig = require(path.resolve('lib', 'webserver.js'));
const makeCall = require(path.resolve('lib', 'makeCall.js'));

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

before(init);

describe('HTTP Routes', function () {
  describe('HealthCheck', function () {
    it('Responds to healtcheck', function (done) {
      client
        .get('/')
        .expect(200, done);
    });
  });

  describe('Ping', function () {
    describe('Ping', function () {
      it('Responds to ping', function (done) {
        client
          .get('/ping')
          .expect(200)
          .end(function (err, res) {
            assert.isNull(err);
            assert.isNotNull(res.text);
            assert.equal(res.text, 'Pong');
            done();
          });
      });
    });

    describe('Mirror', function () {
      it('Responds to mirror', function (done) {
        const input = {
          message: 'hello'
        };

        client
          .post('/mirror')
          .send(input)
          .expect(200)
          .end(function (err, res) {
            assert.isNull(err);
            assert.isNotNull(res.body);
            assert.isObject(res.body);
            assert.deepEqual(res.body.mirror, input);
            done();
          });
      });

      it('Responds to mirror /w strict false', function (done) {
        const input = {
          test: 'hello'
        };

        client
          .post('/mirror')
          .query({
            strict: 'false'
          })
          .send(input)
          .expect(200)
          .end(function (err, res) {
            assert.isNull(err);
            assert.isNotNull(res.body);
            assert.isObject(res.body);
            assert.deepEqual(res.body.mirror, input);
            done();
          });
      });

      it('Correct payload to mirror /w strict true', function (done) {
        const input = {
          message: 'hello'
        };

        client

          .post('/mirror')
          .query({
            strict: 'true'
          })
          .send(input)
          .expect(200)
          .end(function (err, res) {
            assert.isNull(err);
            assert.isNotNull(res.body);
            assert.isObject(res.body);
            assert.deepEqual(res.body.mirror, input);
            done();
          });
      });

      it('Failing payload to mirror /w strict true', function (done) {
        const input = {
          test: 'hello'
        };

        client

          .post('/mirror')
          .query({
            strict: 'true'
          })
          .send(input)
          .expect(400)
          .end(function (err, res) {
            assert.isNull(err);
            assert.isNotNull(res.body);
            assert.isObject(res.body);
            assert.isNotNull(res.body.message);
            assert.isNotNull(res.body.error);
            assert.equal(res.body.message, 'Request Failed');
            // eslint-disable-next-line
            assert.equal(res.body.error, ` should NOT have additional properties - {\"additionalProperty\":\"test\"}`);
            done();
          });
      });
    });

    describe('MakeCall', function () {
      it('Makes a call to github', function (done) {
        const stub = sinon.stub(makeCall, 'RequestPong').callsFake(function (inputUrl, cb) {
          assert.equal(inputUrl, 'testUrl.local');

          return setImmediate(cb, null, 'Hello World!');
        });

        client
          .get('/makeCall/testUrl.local')
          .expect(200)
          .end(function (err, res) {
            assert.isNull(err);
            assert.isObject(res.body);
            assert.equal(res.body.data, 'Hello World!');
            stub.restore();
            done();
          });
      });
    });
  });
});
