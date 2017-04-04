'use strict';

let Feature = require('./feature');
let ScaffoldGenerator = require('./scaffold_generator');

class Project {
  constructor(root) {
    // TODO 抛出异常 如果root 不存在
    this.root = root;
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
    let generator = new ScaffoldGenerator(this);
    require('colors');

    return require('co')(function* () {
      console.log('Processing scaffold:'.blue.bold);
      yield generator.handleScaffold();

      console.log('Processing package.json:'.blue.bold);
      yield generator.updatePackageJson();

      console.log('Processing setup:'.blue.bold);
      yield generator.runSetup();
    }).
      then(r => console.log('SETUP COMPLETED.'.green.bold)).
      catch(e => {
        console.error('SETUP FAILED!'.red.bold);
        console.error(e, e.stack);
      });
  }

}

module.exports = Project;
