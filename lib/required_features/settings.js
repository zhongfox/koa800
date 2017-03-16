'use strict';

let Feature = require('../feature');

let enhance = function() {
  let fs    = require('fs');
  let path  = require('path');
  let merge  = require('merge-util');
  let app = Feature.app;

  let settings    = app.requireModule('config/settings');
  let envSettings = app.requireModule('config/environments/' + app.env);

  // TODO 是不是要预定义一个{}
  merge(settings, envSettings);

  // 加载imago配置, 该文件不在版本库中, 通过npm run imago生成
  if (fs.existsSync(path.join(app.root, 'config/imago.local.js'))) {
    merge(settings, app.requireModule('config/imago.local'));
  }

  // 加载本地配置, 该文件不在版本库中
  if (fs.existsSync(path.join(app.root, 'config/settings.local.js'))) {
    merge(settings, app.requireModule('config/settings.local'));
  }

  app.settings = settings;
};

let scaffold = [
  'config/',
  'config/settings.js',
  'config/environments/',
  'config/environments/development.js',
  'config/environments/production.js',
];

module.exports = new Feature({
  enhance: enhance,
  scaffold: scaffold,
});
