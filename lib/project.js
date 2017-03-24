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
    if (this.koa800Config) return this.config;

    this.koa800Config = require(require('path').join(this.root, 'koa800'));
    return this.koa800Config;
  }

  getFeatures() {
    if (this.features) return this.features;

    this.features = Feature.required.map(featureName => {
      let feature = require(`./required_features/${featureName}`);
      feature.name = featureName;
      return feature;
    });

    let koa800Config = this.getKoa800Config();

    Feature.optional.forEach(featureName => {
      let config = koa800Config[featureName];

      if (config) {
        let feature = require(`./optional_features/${featureName}`);
        feature.config = config;
        feature.name = featureName;

        this.features.push(feature);
      }
    });

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