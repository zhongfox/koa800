'use strict';
let fs   = require('fs');
let path = require('path');

function run(app) {
  let tingyunConfigFile = path.join(app.root, 'tingyun.json');

  if (fs.existsSync(tingyunConfigFile)) {
    process.env.TINGYUN_HOME = app.root; // TODO
    let tingyun = require('tingyun');
    app.monitor = {
      noticeError: function(error, customParamters) {
        if (typeof error === 'string') error = new Error(error);
        let message = '';
        if(customParamters) {
          message = JSON.stringify(customParamters);
        }
        tingyun.noticeError(error, message);
      },
      setTransactionName: function(actionName) {
        tingyun.setWebActionName(actionName);
      }
    };
  }
}

let scaffold = [
  'tingyun.json.example'
];

let packageJson = {
  'dependencies': {
    'tingyun': '1.4.1'
  }
};

let Feature = require('../feature');
module.exports = new Feature({
  run: run,
  scaffold: scaffold,
  packageJson: packageJson
});
