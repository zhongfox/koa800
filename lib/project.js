'use strict';

let Feature = require('./feature');
let ScaffoldGenerator = require('./scaffold_generator');

class Project {
  constructor(root) {
    // TODO 抛出异常 如果root 不存在
    this.root = root;
    this.scaffoldGenerator = new ScaffoldGenerator(this);
  }

  getKoa800Config() {
    if (this.koa800Config) return this.koa800Config;

    // TODO 给错误提示
    this.koa800Config = require(require('path').join(this.root, 'package.json')).koa800Config || {};
    return this.koa800Config;
  }

  getFeatures() {
    if (this.features) return this.features;
    this.features = Feature.getFeatures(this.getKoa800Config());
    return this.features;
  }

  getFeature(name) {
    for (let feature of this.getFeatures()) {
      if (feature.name === name) return feature;
    }
  }

  run(app) {
    // TODO 抛出异常, 如果app.root 和project root 不一致
    this.getFeatures().forEach(function(feature) {
      if (feature.run) {
        feature.run(app);
      }
    });
  }

  setup() {
    let generator = this.scaffoldGenerator;

    return require('co')(function* () {
      yield generator.copyScaffold();
      yield generator.updatePackageJson();
      yield generator.getSetup();
    }).
      then(r => console.log('更新成功')).
      catch(e => console.error(e, e.stack));
  }

}

module.exports = Project;
