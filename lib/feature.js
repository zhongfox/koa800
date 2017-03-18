'use strict';

let path = require('path');
let merge  = require('merge-util');

function Feature(options) {
  // TODO 类型检测
  this.enhance     = options.enhance;
  this.update      = options.update;
  this.packageJson = options.packageJson;
  this.scaffold       = options.scaffold;

  this.config      = options.config;
  this.name = options.name;
}

Feature.required = ['base', 'settings', 'controllers', 'errors', 'start_hooks'];
Feature.optional = {
  // monitor: true,
  // auth: false,
  // eslint: true,
  // jsonp: true,
  // memcached: true,
  // // mysql: false,
  // redis: true,
  // tingyun: true,
  // subdomain: true,
  // thrift: false,
  // union_data_service: false,
  // union_deal_service: false
};

Feature.getFeatures = function(appRoot) {
  if (this.features) return this.features;

  this.features = Feature.required.map(function(featureName) {
    let feature = require(`./required_features/${featureName}`);
    feature.name = featureName;
    return feature;
  });

  let userConfig = require(path.join(appRoot, 'koa800'));
  let mergedConfig = Object.assign({}, Feature.optional, userConfig);

  Object.keys(Feature.optional).forEach(function(featureName) {
    let config = mergedConfig[featureName];

    if (config !== false) {
      let feature = require(`./optional_features/${featureName}`);
      feature.config = config;
      feature.name = featureName;

      Feature.features.push(feature);
    }
  });

  return this.features;
};

Feature.enhanceApp = function(app) {
  this.getFeatures(app.root).forEach(function(feature) {
    if (feature.enhance) {
      feature.enhance(app);
    }
  });
};

module.exports = Feature;
