'use strict';

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let env = require('../../env');

describe('start feature', function() {
  let app;
  beforeEach(function() {
    app = require(env.koa800Root)(env.testAppRoot);
  });

  describe('app.beforeStart', function() {
    it('should throw exception if the args is not a promise', function() {
      let addBeforeStart = function() {
        app.beforeStart(function() {});
      };

      expect(addBeforeStart).to.throw(Error);
    });

    it('should be ok if the args is promise', function() {
      let promiseA = Promise.resolve('Im ok');
      let promiseB = Promise.reject('Im fail');
      let promiseC = new Promise(function() {}); // pendding

      expect(
        app.beforeStart(promiseA).
          beforeStart(promiseB).
          beforeStart(promiseC)
      ).to.equal(app);
    });
  });

  describe('app.start', function() {
    it('should not start if some promise fail', function(done) {
      let promiseA = Promise.resolve('Im ok');
      let promiseB = Promise.reject('Im fail');

      sinon.spy(console, 'error');
      app.beforeStart(promiseA).beforeStart(promiseB).start().then(function() {
        done();
        expect(console.error.calledWith('执行app.beforeStart时出现错误, app启动失败: Im fail')).to.be.true;
      });
    });
  });
});
