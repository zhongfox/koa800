'use strict';

let Feature = require('../feature');

let enhance = function(featureConfig) {
  let app = Feature.app;

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

  app.currentTime = function() {
    let d = new Date();
    return d.toFormat('yyyy-MM-dd hh:mm:ss');
  };

  app.proxy = true;

  app.use(require('koa-logger')());
  app.use(require('koa-favicon')(app.root + '/public/favicon.ico'));
  app.use(require('koa-body')());
};

let scaffold = [
  'app/',
  'config/',
];

module.exports = new Feature({
  enhance: enhance,
  scaffold: scaffold,
});
