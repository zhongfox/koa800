'use strict';

let fileUtil = {};


fileUtil.validFile = function(fname) {
  if (fname[0] === '.') return false;
  return true;
};

fileUtil.validJSFile = function(fname) {
  if (fname[0] === '.') return false;
  if (fname.slice(-3) === '.js') return true;
  return false;
};

fileUtil.getBasename = function(fname) {
  let i = fname.lastIndexOf('.');
  if (i < 0) i = fname.length;
  let basename = fname.substr(0, i);

  if(basename === '') {
    return false;
  } else {
    return basename;
  }
};

module.exports = fileUtil;
