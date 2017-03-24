'use strict';

function Feature(options) {
  // TODO 类型检测
  this.run         = options.run;
  this.setup       = options.setup;
  this.packageJson = options.packageJson;
  this.scaffold    = options.scaffold;
  this.config      = options.config;
  this.name        = options.name;
}

Feature.required = ['base', 'settings', 'controllers', 'errors', 'start_hooks'];
Feature.optional = ['eslint', 'jsonp', 'tingyun', 'memcached', 'redis', 'prepare_commit_msg'];

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
