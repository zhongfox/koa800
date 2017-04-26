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

  app.proxy = true;

  app.monitor = {
    // method placeholder
    noticeError: console.error, // function(err, argsArray) {},
    setTransactionName: function(actionName) {}
  };

  app.use(require('koa-logger')());
  app.use(require('koa-favicon')(app.root + '/public/favicon.ico'));
  app.use(require('koa-body')());
  app.use(require('../middlewares/body_parser'));
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
  'ecosystem.json',
  'bin/',
  'bin/www',
  'app.js',
  'public/',
  'public/favicon.ico'
];

module.exports = new Feature({
  run: run,
  scaffold: scaffold,
  packageJson: packageJson,
  setup: setup
});
