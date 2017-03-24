'use strict';

let run = function(app) {
  app._beforeStartPromises = [];

  app.beforeStart = function(promise) {
    if (promise.constructor !== Promise) {
      throw (new Error('app.beforeStart 期望的参数是一个Promise实例!'));
    }

    app._beforeStartPromises.push(promise);
    return app; // 级联调用
  };

  app.start = function() {
    return Promise.all(app._beforeStartPromises).then(function(results) {
      let port = process.env.PORT || app.settings.port || 4000;
      app.listen(port);
      console.log('Koa server listening on port ' + port + ' ' + app.env);
    }).catch(function(error) {
      console.error(`执行app.beforeStart时出现错误, app启动失败: ${error}`);
    });
  };
};

let Feature = require('../feature');
module.exports = new Feature({
  run: run
});
