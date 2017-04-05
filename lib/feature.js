'use strict';

class Feature {
  constructor(properties) {
    // TODO 类型检测
    this.run          = properties.run;
    this.setup        = properties.setup;
    this.packageJson  = properties.packageJson;
    this.scaffold     = properties.scaffold;
    this.dependencies = properties.dependencies;
    this.config       = properties.config;
    this.name         = properties.name;
  }
}

Feature.required = ['base', 'settings', 'controllers', 'errors', 'start_hooks'];
Feature.optional = ['eslint', 'jsonp', 'tingyun', 'memcached', 'redis', 'prepare_commit_msg', 'auto_routes'];

Feature.load = function(type, featureName, config) {
  let feature = require(`./${type}_features/${featureName}`);
  feature.config = config;
  feature.name = featureName;
  return feature;
};

Feature.getFeatures = function(koa800Config) {
  return this.getRequiredFeatures().concat(this.getOptionalFeatures(koa800Config));
};

Feature.getRequiredFeatures = function() {
  let features = [];

  this.required.forEach(featureName => {
    features.push(this.load('required', featureName));
  });
  return features;
};

Feature.getOptionalFeatures = function(koa800Config) {
  let _koa800Config = Object.assign({}, koa800Config);
  let features = [];

  // 通过feature.dependencies 解析最终的koa800Config, 可优化
  this.optional.forEach(featureName => {
    let config = _koa800Config[featureName];
    if (!config) return;

    let feature = this.load('optional', featureName, config);
    if (feature.dependencies) {
      feature.dependencies.forEach(dependency => {
        _koa800Config[dependency] = _koa800Config[dependency] || true;
      });
    }
  });

  this.optional.forEach(featureName => {
    let config = _koa800Config[featureName];
    if (!config) return;

    let feature = this.load('optional', featureName, config);
    features.push(feature);
  });
  return features;
};

//{
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
//};

module.exports = Feature;
