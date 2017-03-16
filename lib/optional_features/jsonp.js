'use strict';

let Feature = require('../feature');

let enhance = function() {
  let app = Feature.app;
  require('koa-safe-jsonp')(app);
};

let packageJson = {
  'dependencies': {
    'koa-safe-jsonp': '^0.3.1'
  }
};

let feature = new Feature({
  enhance: enhance,
  packageJson: packageJson,
});

module.exports = feature;
