const Ajv = require('ajv');
const path = require('path');

const makeCall = require(path.resolve('lib', 'makeCall.js'));

const ajv = new Ajv({ useDefaults: true });

const mirrorSchema = {
  type: 'object',
  properties: {
    message: {
      type: 'string'
    },
    extraObject: {
      type: 'object'
    }
  },
  required: ['message'],
  additionalProperties: false
};

module.exports = {
  Ping,
  Mirror,
  MakeCall
};

function Ping (req, res, next) {
  return res.status(200).send('Pong');
}

function Mirror (req, res, next) {
  if (req.query['strict'] === 'true') {
    let schemaCheck = ajv.validate(mirrorSchema, req.body);

    if (!schemaCheck) {
      let output = req.databag['output'];
      output.message = 'Request Failed';
      output.error = ajv.errors[0].dataPath + ' ' + ajv.errors[0].message + ' - ' + JSON.stringify(ajv.errors[0].params);
      return res.status(400).send(output);
    }
  }

  return res.status(200).send(req.body);
}

function MakeCall (req, res, next) {
  makeCall.RequestPong(req.params['foo'], function (err, body) {
    if (err) {
      return res.status(500).send(err.message);
    }
    return res.status(200).send(body);
  });
}
