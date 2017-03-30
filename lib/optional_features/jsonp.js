'use strict';

let run = function(app) {
  require('koa-safe-jsonp')(app);
};

let packageJson = {
  'dependencies': {
    'koa-safe-jsonp': '^0.3.1'
  }
};

let scaffold = [
  'app/controllers/filters/',
  'app/controllers/filters/check_referer.js'
];

let Feature = require('../feature');
module.exports = new Feature({
  run: run,
  packageJson: packageJson,
  scaffold: scaffold
});
