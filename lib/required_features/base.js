'use strict';

let Feature = require('../feature');

let run = function(app) {
  app.requireModule = function(relativePathFromRoot) {
    return require(require('path').join(this.root, relativePathFromRoot));
  };

  app.isDevelopment = function() {
    return this.env === 'development';
  };

  app.isProduction = function() {
    return this.env === 'production';
  };

  app.netFT = require('../utils/net_ft');

  app.proxy = true;

  app.monitor = {
    // method placeholder
    noticeError: console.error, // function(err, argsArray) {},
    setTransactionName: function(actionName) {}
  };

  app.use(require('koa-logger')());
  app.use(require('koa-favicon')(app.root + '/public/favicon.ico'));
  app.use(require('koa-body')());

/*process.on('uncaughtException', function(err) {
  // error先被newrelic agent获得, 已经被追踪了, 再次noticeError同一个错误会被忽略
  // 因此需要重新new一个
  console.error('未捕获致命错误原始错误: ' + err); // 输出原始信息
  let error = new app.errors.UncaughtException('未捕获致命错误: ' + err.message);
  error.stack = err.stack;

  console.error('未捕获致命错误');
  console.error(error.stack);
  app.monitor.noticeError(error, {uncaughtException: true});
});*/
};

let setup = function* (root) {
  let packageJsonPath = require('path').join(root, 'package.json');
  let packageJson = require(packageJsonPath);
  let needRewrite = false;

  if (!packageJson.koa800Config) {
    packageJson.koa800Config = {};
  }

  Feature.optional.forEach(featureName => {
    if (packageJson.koa800Config[featureName] === undefined) {
      packageJson.koa800Config[featureName] = false;
      needRewrite = true;
    }
  });

  if (needRewrite) {
    yield require('co-fs').writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  }
};


let packageJson = {
  'scripts': {
    'start': 'node ./bin/www',
    'c': 'node ./node_modules/.bin/c',
    'setup': 'node ./node_modules/.bin/setup',
  }
};

let scaffold = [
  'app/',
  'config/',
  'config/routes/',
  'config/routes/index.js',
  'bin/',
  'bin/www',
  'app.js'
];

module.exports = new Feature({
  run: run,
  scaffold: scaffold,
  packageJson: packageJson,
  setup: setup
});
