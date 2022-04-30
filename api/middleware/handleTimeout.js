const config = require('config');

module.exports = function (req, res, next) {
  res.setTimeout(config.get('http.timeout'), function () {
    return res.status(408).sendWrappedFailure(new Error(`Request Timeout. Exceeded ${config.get('http.timeout')} ms.`));
  });

  return next();
};
