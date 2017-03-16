'use strict';
// TODO
// if (require('fs').existsSync('tingyun.json')) require("tingyun");

let koa800 = function(root) {
  let app = require('koa')();
  let Feature = require('./lib/feature');

  app.root = root || require('path').dirname(module.parent.filename);
  Feature.enhanceApp(app);

  return app;
};

module.exports = koa800;
