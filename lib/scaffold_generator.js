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

  * runSetup() {
    for (let feature of this.project.getFeatures()) {
      if (!feature.setup) continue;
      console.log(`  [${feature.name}]: run setup`.yellow);
      yield feature.setup(this.project.root);
    }
  }

  // copy scaffold from template to app
  * handleScaffold() {
    let fs = require('co-fs');
    let env = {
      projectName: path.basename(this.project.root),
      root: this.project.root,
      require: require
    };

    for (let feature of this.project.getFeatures()) {
      if (!feature.scaffold) continue;
      for (let scaffold of feature.scaffold) {
        let targetPath = path.join(this.project.root, scaffold);
        if (yield fs.exists(targetPath)) continue;

        let sourcePath = path.join(__dirname, '../template', scaffold);
        let stat = yield fs.stat(sourcePath);

        if (stat && stat.isDirectory()) {
          console.log(`  [${feature.name}]: make dir ${targetPath}`.yellow);
          yield fs.mkdir(targetPath);
          continue;
        }

        console.log(`  [${feature.name}]: write file ${targetPath}`.yellow);
        if (['.js', '.json', '.example'].indexOf(path.extname(sourcePath)) >= 0) {
          let sourceContent = yield fs.readFile(sourcePath, 'utf8');
          let targetContent = (new Function('return `' + sourceContent + '`')).bind(env)();
          yield fs.writeFile(targetPath, targetContent);
        } else {
          require('fs').createReadStream(sourcePath).pipe(require('fs').createWriteStream(targetPath));
        }
      }
    }
  }

  * updatePackageJson() {
    // update package.json
    let packageJson = this.getPackageJson();
    if (!!Object.keys(packageJson).length) {
      let packageJsonPath = path.join(this.project.root, 'package.json');
      let projectPackageJson = require(packageJsonPath);
      merge(projectPackageJson, packageJson);
      yield require('co-fs').writeFile(packageJsonPath, JSON.stringify(projectPackageJson, null, 2));
    }
  }

}

module.exports = ScaffoldGenerator;
