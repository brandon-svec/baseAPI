// Imports

// General

var config = {};

config.applicationName = 'baseAPI';

// HTTP Proxy

config.http = {};

config.http.port = 3000;
config.http.timeout = 120000;
config.http.keepAliveTimeoutMS = 60000;
config.http.server = '127.0.0.1';

// SSL
config.ssl = null;

// ** Logging

config.logging = {
  enabled: true
};

// ** Instrumental

config.statsD = null;

// Export

module.exports = config;
