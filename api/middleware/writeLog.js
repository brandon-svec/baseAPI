const config = require('config');
const pino = require('pino');

const log = pino(config.get('logging'));

module.exports = function (req, res, next) {
  req.on('error', processError);

  res.on('abort', processClose);
  res.on('error', processError);
  res.on('finish', processFinish);

  return next();

  function processClose () {
    log.warn(buildLog(), 'Connection Closed');
  }

  function processFinish () {
    const logObj = buildLog();

    if (logObj.statusCode >= 200 && logObj.statusCode < 400) {
      if (req.path !== '/') {
        log.info(logObj, 'Request Complete');
      }
    } else if (logObj.statusCode >= 400 && res.statusCode < 500) {
      log.warn(logObj, 'Request Failed');
    } else if (logObj.statusCode >= 500) {
      log.error(logObj, 'Request Errored');
    }
  }

  function processError (err) {
    const logObj = buildLog();
    logObj.error = err.message;

    log.error(logObj, 'Request Errored');
  }

  function buildLog () {
    const logObj = {
      requestId: req.id,
      statusCode: null,
      sourceIp: req.ip,
      timeTakenMS: Date.now() - req.startTime,
      requestSize: null,
      responseSize: null,
      route: req.path
    };

    if (res.headersSent) {
      logObj.statusCode = res.statusCode;
    }

    if (req.body) {
      logObj.requestSize = req.body.length;
    }

    if (res.body) {
      logObj.responseSize = res.body.length;
    }

    if (res.databag.logData) {
      const keys = Object.keys(res.databag.logData);
      for (let c = 0; c < keys.length; c++) {
        logObj[keys[c]] = res.databag.logData[keys[c]];
      }
    }

    return logObj;
  }
};
