'use strict';
let fs                = require('fs');
let path              = require('path');

// TODO 线上删除
// let monitorConfigFile = path.join(__dirname, '../monitor.local.json');
process.on('uncaughtException', function(err) {
  // error先被newrelic agent获得, 已经被追踪了, 再次noticeError同一个错误会被忽略
  // 因此需要重新new一个
  console.error('未捕获致命错误原始错误: ' + err); // 输出原始信息
  let error = new app.errors.UncaughtException('未捕获致命错误: ' + err.message);
  error.stack = err.stack;

  console.error('未捕获致命错误');
  console.error(error.stack);
  monitor.noticeError(error, {uncaughtException: true});
});

// TODO
// Promise未捕获的reject错误
// process.on('unhandledRejection', function (err, promise) {
//   console.error('未捕获promise reject 错误: ' + err);
//   console.error(err.stack)
// });
function addMonitor(app) {
  let monitor           = null;
  let tingyunConfigFile = path.join(app.root, 'tingyun.json');

  if (fs.existsSync(tingyunConfigFile)) {
    // monitor.setTransactionName = monitor.setWebActionName;
    // console.log(monitor);
    // console.log(monitor.noticeError);
    // console.log(monitor.setTransactionName);
    let tingyun = require('tingyun');
    monitor = {
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
  } else {
    monitor = {
      // 为了调用方便, 确保一定有这个方法
      noticeError: function(err, argsArray) {},
      setTransactionName: function(actionName) {}
    };
  }

  app.monitor = monitor;
}


module.exports = addMonitor;
