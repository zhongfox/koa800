'use strict';
// TODO
// if (require('fs').existsSync('tingyun.json')) require("tingyun");

let koa800 = function(root) {
  let app = require('koa')();
  app.root = root || require('path').dirname(module.parent.filename);

  let Project = require('./lib/project');
  let project = new Project(app.root);

  project.run(app);

  return app;
};

module.exports = koa800;
