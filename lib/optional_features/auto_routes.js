'use strict';
let fs = require('fs');
let path = require('path');
let fileUtil = require('../utils/file_util');

let run = function(app) {
  let routesPath = path.join(app.root, 'config/routes');

  // TODO 处理index不存在的情况
  let indexRouter = app.requireModule('config/routes');

  // 存活监控
  indexRouter.get('/nerver_remove_monit', function* () {
    let d = new Date();
    this.body = d.toFormat('yyyy-MM-dd hh:mm:ss');
  });

  // 首先加载index
  app.use(indexRouter.routes());

  // 按照子域名加载
  fs.readdirSync(routesPath).filter(fileUtil.validJSFile).forEach(function(fname) {
    let moduleName = fileUtil.getBasename(fname);
    if (moduleName === 'index') return; // 已经加载

    let router = app.requireModule(`config/routes/${moduleName}`);
    let subdomainRouter = require('koa-sub-domain')(moduleName, router.routes());
    app.use(subdomainRouter);
  });
};

let packageJson = {
  'dependencies': {
    'koa-sub-domain': '^1.0.2'
  }
};

let Feature = require('../feature');
module.exports = new Feature({
  run: run,
  packageJson: packageJson
});
