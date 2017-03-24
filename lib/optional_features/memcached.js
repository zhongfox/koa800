'use strict';

function createClient(locations, options) {
  let Memcached = require('co-memcached');
  let app = Feature.app;

  // 建立连接
  let memcached = new Memcached(locations, options);

  memcached.on('issue', function(details) {
    let message = 'Memcached error: ' + details.server + ' had an issue: ' +
      details.messages.join(',');
    let err = new Error(message);

    app.monitor.noticeError(err, details);
    console.error(message, details);
  });

  memcached.on('failure', function(details) {
    let message = 'Memcached error: ' + details.server + ' went down: ' +
      details.messages.join(',');
    let err = new Error(message);

    app.monitor.noticeError(err, details);
    console.error(message, details);
  });

  memcached.on('reconnecting', function(details) {
    let message = 'Memcached error: ' + details.server + ' reconnecting';
    let err = new Error(message);

    app.monitor.noticeError(err, details);
    console.error(message, details);
  });

  memcached.on('reconnect', function(details) {
    let message = 'Memcached error: ' + details.server + ' reconnect';
    let err = new Error(message);

    app.monitor.noticeError(err, details);
    console.error(message, details);
  });

  return memcached;
}

let packageJson = {
  'dependencies': {
    'co-memcached': '^1.0.1',
  }
};

let run = function(app) {
  let config = app.settings.memcached;

  if (config && config.locations) {
    app.cache = createClient(config.locations, config.options);
  }
};

let Feature = require('../feature');
module.exports = new Feature({
  packageJson: packageJson,
  run: run
});
