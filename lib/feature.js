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

Feature.required = ['base', 'settings', 'controllers', 'errors', 'start'];
Feature.optional = {
  // monitor: true,
  // auth: false,
  eslint: true,
  jsonp: true,
  // memcached: false,
  // mysql: false,
  // redis: false,
  // subdomain: true,
  // thrift: false,
  // union_data_service: false,
  // union_deal_service: false
};

Feature.setApp = function(app) {
  this.app = app;
  this.root = app.root;
};

Feature.setRoot = function(root) {
  this.root = root;
};

Feature.enhanceApp = function(app) {
  this.setApp(app);

  this.getValidFeatures().forEach(function(feature) {
    if (feature.enhance) {
      feature.enhance();
    }
  });
};

Feature.makeScaffold = function(root) {
  this.setRoot(root);

  return require('co')(function* () {
    yield Feature.copyScaffold();
    yield Feature.updatePackageJson();
    yield Feature.getUpdate();
  }).
    then(r => console.log('更新成功')).
    catch(e => console.error(e, e.stack));
};

// copy scaffold from template to app
Feature.copyScaffold = function* () {
  let fs = require('co-fs');

  for (let scaffold of this.getScaffold()) {
    let targetPath = path.join(this.root, scaffold);
    if (yield fs.exists(targetPath)) continue;

    let sourcePath = path.join(__dirname, '../template', scaffold);
    let stat = yield fs.stat(sourcePath);

    if (stat && stat.isDirectory()) {
      yield fs.mkdir(targetPath);
      continue;
    }

    require('fs').createReadStream(sourcePath).pipe(require('fs').createWriteStream(targetPath));
  }
};

Feature.updatePackageJson = function* () {
  // update package.json
  let packageJson = this.getPackageJson();
  if (!!Object.keys(packageJson).length) {
    let projectPackageJson = require(path.join(this.root, 'package.json'));
    merge(projectPackageJson, packageJson);
    console.log(projectPackageJson); // TODO
  }
};

Feature.getValidFeatures = function() {
  if (this.validFeatures) return this.validFeatures;

  this.validFeatures = Feature.required.map(function(featureName) {
    let feature = require(`./required_features/${featureName}`);
    feature.name = featureName;
    return feature;
  });

  let userConfig = require(path.join(this.root, 'koa800'));
  let mergedConfig = Object.assign({}, Feature.optional, userConfig);

  Object.keys(Feature.optional).forEach(function(featureName) {
    let config = mergedConfig[featureName];

    if (config !== false) {
      let feature = require(`./optional_features/${featureName}`);
      feature.config = config;
      feature.name = featureName;

      Feature.validFeatures.push(feature);
    }
  });

  return this.validFeatures;
};

Feature.getPackageJson = function() {
  if (this.packageJson) return this.packageJson;

  this.packageJson = {};
  this.getValidFeatures().forEach(feature => {
    if (feature.packageJson) {
      this.packageJson = merge(this.packageJson, feature.packageJson);
    }
  });

  return this.packageJson;
};

Feature.getUpdate = function() {
  if (this.update) return this.update;

  this.update = {};
  this.getValidFeatures().forEach(feature => {
    if (feature.update) {
      this.update[feature.name] = feature.update();
    }
  });

  return this.update;
};

Feature.getScaffold = function() {
  if (this.scaffold) return this.scaffold;

  this.scaffold = [];
  this.getValidFeatures().forEach(feature => {
    if (feature.scaffold) {
      this.scaffold = this.scaffold.concat(feature.scaffold);
    }
  });

  return this.scaffold;
};

module.exports = Feature;
