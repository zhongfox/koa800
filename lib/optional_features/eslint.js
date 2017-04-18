'use strict';

let path    = require('path');
let Feature = require('../feature');

let packageJson = {
  'devDependencies': {
    'eslint': '^3.12.2',
    'eslint-config-google': '^0.7.1'
  },
  'eslintConfig': {
    'extends': 'google'
  }
};

let setup = function* (root) {
  let fs         = require('co-fs');
  let srcFile    = path.join(__dirname, '../../bin/pre-commit');
  let targetDir  = path.join(root, this.gitHooksDir);
  let targetFile = path.join(targetDir, 'pre-commit');

  if (!(yield fs.exists(targetDir))) {
    console.error(`${targetDir} 不存在!`);
    return;
  }

  // 删掉旧的pre-commit
  try {
    yield fs.unlink(targetFile);
  } catch(e) {
  }

  try {
    yield fs.symlink(srcFile, targetFile);
  } catch(e) {
    console.error(e);
    return;
  }

  // 验证
  let resultChecker = yield {
    link: fs.readlink(targetFile),
    targetStat: fs.stat(targetFile),
    srcStat: fs.stat(srcFile)
  };

  if (resultChecker.link === srcFile &&      // 检查链接是否正确
      resultChecker.targetStat.mode & 64 &&  // 检查目标文件是否可执行
        resultChecker.srcStat.mode & 64) {   // 检查源文件是否可以执行
    console.log('成功');
  } else {
    console.log('失败');
  }
};

let feature = new Feature({
  packageJson: packageJson,
  setup: setup
});

feature.gitHooksDir = '.git/hooks';

module.exports = feature;
