'use strict';

let run = function(app) {
  let util   = require('util');
  let errors = {};

  if (require('fs').existsSync(require('path').join(app.root, 'config/errors.js'))) {
    let errorNames = app.requireModule('config/errors');
    errorNames.forEach(function(errorClass) {
      errors[errorClass] = function(message) {
        Error.call(this);
        Error.captureStackTrace(this, errors[errorClass]);
        this.message = message;
        this.name = errorClass;
      };

      util.inherits(errors[errorClass], Error);
    });
  }

  app.errors = errors;
};

let scaffold = [
  'config/errors.js'
];

let Feature = require('../feature');
module.exports = new Feature({
  run: run,
  scaffold: scaffold
});
