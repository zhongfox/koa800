'use strict';
let fs   = require('fs');
let path = require('path');

function enhance(app) {
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
    'tingyun': '1.1.14'
  }
};

let Feature = require('../feature');
module.exports = new Feature({
  enhance: enhance,
  scaffold: scaffold,
  packageJson: packageJson
});
