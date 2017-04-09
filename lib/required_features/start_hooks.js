'use strict';

let handleUncaughtException = function() {
  process.on('uncaughtException', function(err) {
    // error先被apm agent获得, 已经被追踪了, 再次noticeError同一个错误会被忽略
    // 因此需要重新new一个
    console.error('未捕获致命错误原始错误: ' + err); // 输出原始信息
    let error = new Error('未捕获致命错误: ' + err.message);
    error.name = 'UncaughtException';
    error.stack = err.stack;

    console.error('未捕获致命错误');
    console.error(error.stack);
    app.monitor.noticeError(error, {uncaughtException: true});
  });
};

let run = function(app) {
  app._beforeStartActions = [];

  app.beforeStart = function(action) {
    if (action.constructor !== Promise &&
        action.constructor !== Function) {
      throw (new Error('app.beforeStart 期望的参数是一个Promise实例或者函数!'));
    }

    app._beforeStartActions.push(action);
    return app; // 级联调用
  };

  app.start = function() {
    app._beforeStartActions.map(action => {
      if (action.constructor === Promise) return action;

      // 延迟执行的操作
      if (action.constructor === Function) {
        let actionResult = action();
        if (actionResult && actionResult.constructor === Promise) return actionResult;

        return Promise.resolve(actionResult);
      }

      throw (new Error('app._beforeStartActions 期望的参数是一个Promise实例或者函数'));
    });

    return Promise.all(app._beforeStartActions).then(function(results) {
      let port = process.env.PORT || app.settings.port || 4000;
      app.listen(port);
      console.log('Koa server listening on port ' + port + ' ' + app.env);
      handleUncaughtException();
    }).catch(function(error) {
      console.error(`执行app.beforeStart时出现错误, app启动失败: ${error}`);
    });
  };
};

let Feature = require('../feature');
module.exports = new Feature({
  run: run
});
