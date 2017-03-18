'use strict';

let Feature = require('./feature');
let merge  = require('merge-util');
let path = require('path');

function ScaffoldMaker(appRoot) {
  this.appRoot = appRoot;
}

ScaffoldMaker.prototype.getPackageJson = function() {
  if (this.packageJson) return this.packageJson;

  this.packageJson = {};
  Feature.getFeatures(this.appRoot).forEach(feature => {
    if (feature.packageJson) {
      this.packageJson = merge(this.packageJson, feature.packageJson);
    }
  });

  return this.packageJson;
};

ScaffoldMaker.prototype.getUpdate = function() {
  if (this.update) return this.update;

  this.update = {};
  Feature.getFeatures(this.appRoot).forEach(feature => {
    if (feature.update) {
      this.update[feature.name] = feature.update(this.appRoot);
    }
  });

  return this.update;
};

ScaffoldMaker.prototype.getScaffold = function() {
  if (this.scaffold) return this.scaffold;

  this.scaffold = [];
  Feature.getFeatures(this.appRoot).forEach(feature => {
    if (feature.scaffold) {
      this.scaffold = this.scaffold.concat(feature.scaffold);
    }
  });

  return this.scaffold;
};

// copy scaffold from template to app
ScaffoldMaker.prototype.copyScaffold = function* () {
  let fs = require('co-fs');
  let env = {
    appRoot: this.appRoot,
    require: require
  };

  for (let scaffold of this.getScaffold(this.appRoot)) {
    let targetPath = path.join(this.appRoot, scaffold);
    if (yield fs.exists(targetPath)) continue;

    let sourcePath = path.join(__dirname, '../template', scaffold);
    let stat = yield fs.stat(sourcePath);

    if (stat && stat.isDirectory()) {
      yield fs.mkdir(targetPath);
      continue;
    }

    if (['.js', '.json', '.example'].indexOf(path.extname(sourcePath)) >= 0) {
      let sourceContent = yield fs.readFile(sourcePath, 'utf8');
      let targetContent = (new Function('return `' + sourceContent + '`')).bind(env)();
      yield fs.writeFile(targetPath, targetContent);
    } else {
      require('fs').createReadStream(sourcePath).pipe(require('fs').createWriteStream(targetPath));
    }
  }
};

ScaffoldMaker.prototype.updatePackageJson = function* () {
  // update package.json
  let packageJson = this.getPackageJson(this.appRoot);
  if (!!Object.keys(packageJson).length) {
    let projectPackageJson = require(path.join(this.appRoot, 'package.json'));
    merge(projectPackageJson, packageJson);
    console.log(projectPackageJson); // TODO
  }
};

ScaffoldMaker.prototype.make = function() {
  let maker = this;
  return require('co')(function* () {
    yield maker.copyScaffold();
    yield maker.updatePackageJson();
    yield maker.getUpdate();
  }).
    then(r => console.log('更新成功')).
    catch(e => console.error(e, e.stack));
};

module.exports = ScaffoldMaker;
