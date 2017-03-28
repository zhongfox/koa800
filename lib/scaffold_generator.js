'use strict';

let merge  = require('merge-util');
let path = require('path');

class ScaffoldGenerator {

  constructor(project) {
    this.project = project;
  }

  getPackageJson() {
    if (this.packageJson) return this.packageJson;

    this.packageJson = {};
    this.project.getFeatures().forEach(feature => {
      if (feature.packageJson) {
        this.packageJson = merge(this.packageJson, feature.packageJson);
      }
    });

    return this.packageJson;
  }

  getSetup() {
    if (this.setup) return this.setup;

    this.setup = {};
    this.project.getFeatures().forEach(feature => {
      if (feature.setup) {
        this.setup[feature.name] = feature.setup(this.project.root);
      }
    });

    return this.setup;
  }

  getScaffold() {
    if (this.scaffold) return this.scaffold;

    this.scaffold = [];
    this.project.getFeatures().forEach(feature => {
      if (feature.scaffold) {
        this.scaffold = this.scaffold.concat(feature.scaffold);
      }
    });

    return this.scaffold;
  }

  // copy scaffold from template to app
  * copyScaffold() {
    let fs = require('co-fs');
    let env = {
      projectName: path.basename(this.project.root),
      root: this.project.root,
      require: require
    };

    for (let scaffold of this.getScaffold()) {
      let targetPath = path.join(this.project.root, scaffold);
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
  }

  * updatePackageJson() {
    // update package.json
    let packageJson = this.getPackageJson();
    if (!!Object.keys(packageJson).length) {
      let packageJsonPath = path.join(this.project.root, 'package.json');
      let projectPackageJson = require(packageJsonPath);
      let fs = require('co-fs');
      merge(projectPackageJson, packageJson);
      yield fs.writeFile(packageJsonPath, JSON.stringify(projectPackageJson, null, 2));
    }
  }

}

module.exports = ScaffoldGenerator;
