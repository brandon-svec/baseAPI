const request = require('request');

module.exports = {
  RequestPong
};

function RequestPong (target, cb) {
  const httpOptions = {
    url: 'https://' + target,
    method: 'get'
  };

  request(httpOptions, function (err, response, body) {
    if (err) {
      return cb(err);
    }

    if (response.statusCode !== 200) {
      return cb(new Error(body));
    }

    return cb(null, body);
  });
}
