const uuid = require('node-uuid');

module.exports = function (req, res, next) {
  res.databag = {
    id: uuid.v4(),
    logData: {}
  };

  res.sendWrappedSuccess = function (obj = {}) {
    let output = {
      requestId: res.databag.id,
      message: 'Request Successful'
    };

    output = Object.assign(output, obj);
    return this.status(200).send(output);
  };

  res.sendWrappedFailure = function (err) {
    const output = {
      requestId: res.databag.id,
      message: 'Request Failed',
      error: err.message
    };

    if (res.statusCode === 200) {
      res.status(400);
    }

    return res.send(output);
  };

  res.sendWrappedError = function (err) {
    const output = {
      requestId: res.databag.id,
      message: 'Request Errored',
      error: err.message
    };

    if (!res.statusCode) {
      res.setStatus(500);
    }

    return res.send(output);
  };

  return next();
};
