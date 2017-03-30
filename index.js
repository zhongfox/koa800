'use strict';
// TODO
// if (require('fs').existsSync('tingyun.json')) require("tingyun");

let koa800 = function(root) {
  let app = require('koa')();
  app.root = root || require('path').dirname(module.parent.filename);

  let appPath = require('path').join(app.root, 'app.js');

  // 对app.js 提前导出, 解决循环require app.js问题
  if (module.parent.id === appPath) {
    module.parent.exports = app;
  }

  let Project = require('./lib/project');
  let project = new Project(app.root);

  project.run(app);

  return app;
};

module.exports = koa800;
