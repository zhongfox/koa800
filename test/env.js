'use strict';

let path                = require('path');
let env = {};
env.koa800Root       = path.join(__dirname, '..');
env.testAppRoot      = path.join(__dirname, '../test/test_app');
env.testScaffoldRoot = path.join(__dirname, '../test/test_scaffold');
env.Feature          = require(path.join(env.koa800Root, 'lib/feature'));

env.isAllExists = function(fileList) {
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


module.exports = env;
