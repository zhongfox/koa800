'use strict';

let Feature = require('../feature');

let packageJson = {
  'devDependencies': {
    'eslint': '^3.12.2',
    'eslint-config-zhe800': '*'
  },
  'eslintConfig': {
    'extends': 'zhe800'
  }
};

let update = function* () {
  let fs         = require('co-fs');
  let path       = require('path');
  let srcFile    = path.join(__dirname, '../../bin/pre-commit');
  let targetDir  = path.join(Feature.root, '.git/hooks');
  let targetFile = path.join(targetDir, 'pre-commit');

  if (!(yield fs.exists(targetDir))) {
    console.error(`${targetDir} 不存在!`);
    return;
  }

  // TODO 增加force参数
  if (!(yield fs.exists(targetFile))) {
    // TODO try catch 成功没有返回值
    yield fs.symlink(srcFile, targetFile);
      // if (err) {
      //   console.log('添加链接文件失败: ' + targetFile);
      // } else {
      //   console.log('成功添加链接文件: ' + targetFile);
      // }
  }
};

let feature = new Feature({
  packageJson: packageJson,
  update: update
});

module.exports = feature;
