'use strict';

/*
调用示例

//curl http://127.0.0.1:9000/ft_test
module.exports.ft_test = function* () {
  let r = yield app.netFT(
    require('co-request').get('http://127.0.0.1:9000/net_test'),
    function() { return app.redis.master.get('_abc'); }
    , {timeout: 3000, type: 'http'}
  );

  // let r = yield app.netFT(
  //   require('co-request').get('http://127.0.0.1:9000/net_test'),
  //   'backup data',
  //   { plain: true}
  // );
  //
  // let r = yield app.netFT(
  //   require('co-request').get('http://127.0.0.1:9000/net_test'),
  //   function () { return 'backup data from function' },
  //   { plain: true}
  // );

  this.body = r.body ? r.body : r;
};

function sleep(ms){
  return function(callback){
    setTimeout(callback, ms);
  };
}

module.exports.net_test = function* () {
  yield sleep(2000);
  this.body = '耗时教久的网络请求';
};
*/

/**
 * netFT: net fault tolerance
 *
 * @public
 * @param {*} YieldableNetAction co中yieldables, 可以被yield调用的对象, 比如:
 *                - promises
 *                - thunks (functions)
 *                - array (parallel execution)
 *                - objects (parallel execution)
 *                - generators (delegation)
 *                - generator functions (delegation)
 * @param {*} faultTolerance YieldableNetAction 失败后的降级数据来源
 *                - 如果options.plain为true, 表示faultTolerance是基本对象, 不会进行yield调用,
 *                  进一步判断, 如果faultTolerance是function, 则调用并返回, 否则直接返回
 *                - 如果options.plain为false(默认情况), 表示faultTolerance是异步网络请求, 会使用yield调用
 *                - faultTolerance被设计为不能直接传递promise对象, 原因是希望降级调用惰性加载
 * @param {Object} options 可选参数
 *                - timeout: YieldableNetAction 的超时时间, 默认是1秒, 超过这个时间, 将使用faultTolerance
 *                - plain: 默认false, 如果为true, 表示faultTolerance是基本对象, 不会被yield调用
 *                - type: YieldableNetAction 的类型, 这是用于容错判断的, 目前支持的类型有:
 *                  http: 这种情况, 将会检查返回的对象的状态码, 如果status>=400 则视为失败.http客户端请统一使用co-request
 * @return {*} 返回YieldableNetAction或者faultTolerance的返回值
 */
let netFT = function* (YieldableNetAction, faultTolerance, options) {
  options = options || {};
  let timeout = options.timeout || 1000;
  let plain = options.plain || false;
  let type = options.type;
  let timer, result, netPromise;

  if (YieldableNetAction.constructor.name === 'Promise') {
    netPromise = YieldableNetAction;
  } else {
    netPromise = require('co')(YieldableNetAction);
  }

  let timeoutPromise = new Promise(function(resolve, reject) {
    timer = setTimeout(function() {
      let err = new Error('netFT Timeout Error');
      err.name = 'NetFTError';
      reject(err);
    }, timeout);
  });

  try {
    result = (yield Promise.race([netPromise, timeoutPromise]));
    clearTimeout(timer);

    if (type === 'http' && result.statusCode >= 400) {
      let err = new Error('netFT http status: ' + result.statusCode);
      err.name = 'NetFTError';
      throw err;
    }
  } catch(e) {
    if (timer) clearTimeout(timer);

    console.error(e);
    console.error(e.stack);
    if (typeof app !== 'undefined' && typeof app.monitor === 'function') {
      app.monitor.noticeError(e);
    }

    if (plain) {
      if (typeof faultTolerance === 'function') {
        result = faultTolerance(e);
      } else {
        result = faultTolerance;
      }
    } else {
      result = yield faultTolerance(e);
    }
  }

  return result;
};

module.exports = netFT;
