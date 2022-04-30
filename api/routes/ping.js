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
  if (req.query.strict === 'true') {
    const schemaCheck = ajv.validate(mirrorSchema, req.body);

    if (!schemaCheck) {
      return res.sendWrappedFailure(new Error(ajv.errors[0].dataPath + ' ' + ajv.errors[0].message + ' - ' + JSON.stringify(ajv.errors[0].params)));
    }

    return res.sendWrappedSuccess({ mirror: req.body });
  }

  return res.sendWrappedSuccess({ mirror: req.body });
}

function MakeCall (req, res, next) {
  makeCall.RequestPong(req.params.foo, function (err, body) {
    if (err) {
      return res.sendWrappedError(err);
    }
    return res.sendWrappedSuccess({ data: body });
  });
}
