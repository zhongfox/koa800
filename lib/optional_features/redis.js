'use strict';

function createClient(port, host, options) {
  let rawClient = require('ioredis').createClient(port, host, options);
  let client = require('co-redis')(rawClient); // 适用于co的redis连接
  client.raw = rawClient; // 原生redis连接
  return client;
}

let packageJson = {
  'dependencies': {
    'co-redis': '^2.1.0',
    'ioredis': '^1.15.1',
  }
};

let enhance = function(app) {
  let projectRedisConfig = app.settings.redis;
  app.redis = {};

  Object.keys(projectRedisConfig).forEach(function(redisName) {
    let redisConfig = projectRedisConfig[redisName];

    if (redisConfig.port && redisConfig.host) {
      app.redis[redisName] = createClient(redisConfig.port, redisConfig.host, redisConfig.config || {});
    }
  });
};

let Feature = require('../feature');
module.exports = new Feature({
  packageJson: packageJson,
  enhance: enhance
});
