// Import External Modules

// Import Internal Modules

// Export

module.exports = {
  run: fn_external_run,
  EnableMock: fn_external_enableMock
};

// Init

// Routes

function fn_external_run (req, res, next) {
  res.sendStatus(200);
}

// Functions

// Internal

// Mock

function fn_external_enableMock () {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Error: Cannot enable MOCK in Production');
  }

  return true;
}
