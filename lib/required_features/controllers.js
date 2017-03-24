'use strict';
let fs = require('fs');
let path = require('path');

function validFile(fname) {
  if (fname[0] === '.') {
    return false;
  } else {
    return true;
  }
}

function addActions(controllers, basename, actions) {
  for (let action in actions) {
    if (actions.hasOwnProperty(action)) {
      actions[action].controllerName = basename;
      actions[action].actionName = action;
    }
  }
  Object.assign(controllers[basename], actions);
}

function getJsFileBasename(filename) {
  let i = filename.lastIndexOf('.');
  if (i < 0) i = filename.length;
  let basename = filename.substr(0, i);

  if(basename === '') {
    return false;
  } else {
    return basename;
  }
};

let run = function(app) {
  let controllersPath = path.join(app.root, 'app/controllers');
  let controllers = {};

  fs.readdirSync(controllersPath).filter(validFile).forEach(function(name) {
    let basename = getJsFileBasename(name);

    if (!basename) return;

    let ctrlMainFile = controllersPath + '/' + name;
    controllers[basename] = {};

    if (name.slice(-3) === '.js') {
      // 单个文件内写所有的action
      addActions(controllers, basename, require(ctrlMainFile));
    } else {
      // 将action分散在各个文件里面
      fs.readdirSync(ctrlMainFile).filter(validFile).forEach(function(f) {
        let actionFile = ctrlMainFile + '/' + f;

        if (f.slice(-3) !== '.js') {
          console.error('controller不允许三级目录: ' + actionFile);
          process.exit(-1);
        }

        addActions(controllers, basename, require(actionFile));
      });
    }
  });

  app.controllers = controllers;
};

let scaffold = [
  'app/controllers/'
];

let Feature = require('../feature');
module.exports = new Feature({
  run: run,
  scaffold: scaffold
});
