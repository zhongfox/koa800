'use strict';


let enhance = function(app) {
  require('koa-safe-jsonp')(app);
};

let packageJson = {
  'dependencies': {
    'koa-safe-jsonp': '^0.3.1'
  }
};

let Feature = require('../feature');
module.exports = new Feature({
  enhance: enhance,
  packageJson: packageJson,
});
