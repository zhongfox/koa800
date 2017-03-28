'use strict';

let path    = require('path');
let Feature = require('../feature');

let setup = function* (root) {
  let fs         = require('co-fs');
  let srcFile    = path.join(__dirname, '../../bin/prepare-commit-msg');
  let targetDir  = path.join(root, this.gitHooksDir);
  let targetFile = path.join(targetDir, 'prepare-commit-msg');
  let force      = this.config && this.config.force;

  if (!(yield fs.exists(targetDir))) {
    console.error(`${targetDir} 不存在!`);
    return;
  }

  if ((yield fs.exists(targetFile)) && !force) return;

  try {
    yield fs.symlink(srcFile, targetFile);
  } catch(e) {
    console.error('setup 失败');
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
  setup: setup
});

feature.gitHooksDir = '.git/hooks';

module.exports = feature;
