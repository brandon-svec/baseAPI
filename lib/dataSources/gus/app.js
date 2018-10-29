// Import External Modules

    var Ajv = require('ajv');
    var ajv = new Ajv({ useDefaults: true });

    var config = require('config');

// Import Internal Modules

    const client = require('./lib/gusConnection');

// Schemas

const moduleSchema = {
  input: {
    id: 'inputSchema',
    type: 'object',
    properties: {
    },
    required: []
  },
  output: {
    id: 'outputSchema',
    type: 'object',
    properties: {
    },
    required: []
  }
};

// Export

module.exports = {
  Init: fn_external_init,
  GetSchema: fn_external_getSchema,
  Run: fn_external_run
};

// Functions

// External

function fn_external_run (_input, cb) {
  var err = fn_internal_validateInputSchema(_input);

  if (err) {
    cb(err);
    return false;
  } else {
    fn_internal_run(cb);
    return true;
  }
}

function fn_external_init (cb) {
  fn_internal_init(cb);
  return true;
}

function fn_external_getSchema () {
  return moduleSchema;
}

// Internal

function fn_internal_run (cb) {
    client.Init(cb);
  return true;
}

function fn_internal_init (cb) {
  cb();
  return true;
}

function fn_internal_validateInputSchema (_payload) {
  var schemaCheck = ajv.validate(moduleSchema.input, _payload);

  if (!schemaCheck) {
    return new Error(ajv.errors[0].dataPath + ' ' + ajv.errors[0].message + ' - ' + JSON.stringify(ajv.errors[0].params));
  } else {
    return null;
  }
}

function fn_internal_validateOutputSchema (_payload) {
  var schemaCheck = ajv.validate(moduleSchema.output, _payload);

  if (!schemaCheck) {
    return new Error(ajv.errors[0].dataPath + ' ' + ajv.errors[0].message + ' - ' + JSON.stringify(ajv.errors[0].params));
  } else {
    return null;
  }
}
