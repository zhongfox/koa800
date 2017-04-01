'use strict';

let helper = {};
let path             = require('path');
helper.koa800Root       = path.join(__dirname, '..');
helper.testAppRoot      = path.join(__dirname, '../test/test_app');
helper.testScaffoldRoot = path.join(__dirname, '../test/test_scaffold');
helper.Project          = require(path.join(helper.koa800Root, 'lib/project'));
helper.Feature          = require(path.join(helper.koa800Root, 'lib/feature'));

helper.isAllExists = function(fileList) {
  let allExists = true;

  let checker = fileList.map(function(file) {
    return new Promise(function(resolve, reject) {
      require('fs').exists(file, function(exists) {
        if (!exists) allExists = false;
        resolve(exists);
      });
    });
  });

  return Promise.all(checker).then(function() {
    return allExists;
  });
};

helper.restorePackage = function() {
  let fs = require('fs');
  let packageJsonPath = path.join(helper.testScaffoldRoot, 'package.json');
  let backupPackageJsonPath = path.join(helper.testScaffoldRoot, 'package.json.backup');
  fs.createReadStream(backupPackageJsonPath).pipe(fs.createWriteStream(packageJsonPath));
};

let moduleNames = ['co-memcached', 'co-redis', 'ioredis', 'koa-safe-jsonp', 'koa-sub-domain', 'tingyun'];
let Module = require('module');
let realResolve = Module._resolveFilename;
Module._resolveFilename = function fakeResolve(request, parent) {
  if (moduleNames.indexOf(request) >= 0) {
    return realResolve(path.join(helper.koa800Root, `test/node_modules/${request}`), parent);
    // return path.join(helper.koa800Root, `test/node_modules/${request}/index.js`);
  }
  return realResolve(request, parent);
};



module.exports = helper;
