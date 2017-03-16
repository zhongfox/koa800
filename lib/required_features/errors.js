'use strict';

let Feature = require('../feature');

let enhance = function() {
  let app = Feature.app;
  let util   = require('util');
  let errors = {};

  if (require('fs').existsSync(require('path').join(app.root, 'config/errors.js'))) {
    let errorNames = app.requireModule('config/errors');
    errorNames.forEach(function(errorClass) {
      errors[errorClass] = function(message) {
        Error.call(this);
        Error.captureStackTrace(this, arguments.callee);
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

module.exports = new Feature({
  enhance: enhance,
  scaffold: scaffold
});
