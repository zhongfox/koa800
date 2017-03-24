'use strict';

let path    = require('path');
let Feature = require('../feature');

// TODO
Feature.gitHooksDir = function() {
  return '.git/hooks';
};

let update = function* (appRoot) {
  let fs         = require('co-fs');
  let srcFile    = path.join(__dirname, '../../bin/prepare-commit-msg');
  let targetDir  = path.join(appRoot, Feature.gitHooksDir());
  let targetFile = path.join(targetDir, 'prepare-commit-msg');

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
  update: update
});


module.exports = feature;
