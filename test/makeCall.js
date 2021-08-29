process.env.NODE_ENV = 'test';
process.env.NODE_CONFIG_DIR = './config/';

const assert = require('chai').assert;
const nock = require('nock');
const path = require('path');

const client = require(path.resolve('lib', 'makeCall.js'));

describe('makeCall', function () {
  describe('RequestPong', function () {
    it('Run RequestPong', function (done) {
      nock('https://www.example.com')
        .get('/')
        .reply(200, 'domain matched');

      client.RequestPong('www.example.com', function (err, body) {
        assert.isNull(err);
        assert.equal(body, 'domain matched');
        done();
      });
    });
  });
});
