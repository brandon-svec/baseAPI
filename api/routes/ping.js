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
  res.addLogData('startTime', res.databag.startTime);
  res.addAttribute('Sport', 'Table Tennis');

  if (req.query.doubleSend) {
    res.sendWrappedSuccess();
  }

  if (req.query.doubleError) {
    res.status(501);
    res.sendWrappedError(new Error('Something Broke'));
    return res.sendWrappedError(new Error('Something Broke'));
  }

  return res.sendWrappedSuccess({ data: 'Pong' });
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
  const startTime = Date.now();
  makeCall.RequestPong(req.params.foo, function (err, body) {
    res.addTelemetry('RequestPong', Date.now() - startTime);
    if (err) {
      return res.sendWrappedError(err);
    }
    return res.sendWrappedSuccess({ data: body });
  });
}
