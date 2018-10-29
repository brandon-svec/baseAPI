// Imports

// General

var config = {};

config.gus = {};

config.gus.user = process.env.gus_usr || '***';
config.gus.pwd = process.env.gus_pwd || '***';

config.gus.connection = {};
config.gus.connection.loginUrl = process.env.gus_auth || 'https://login.salesforce.com';
