'use strict';

let chai = require('chai');
let sinon = require('sinon');
let expect = chai.expect;
let helper = require('../../test_helper');

let app;
// let project;
// let targetFeature;

describe('start_hooks feature', function() {
  describe('#run', function() {
    beforeEach(function() {
      app = require(helper.koa800Root)(helper.testAppRoot);
      app._beforeStartActions = [];
    });

    describe('app.beforeStart', function() {
      it('should throw exception if the args is neither a promise nor a function', function() {
        let addBeforeStart = function() {
          app.beforeStart({});
        };

        expect(addBeforeStart).to.throw(Error);
      });

      it('should not throw exception if the args is a promise', function() {
        let startAction = Promise.resolve(1);
        let addBeforeStart = function() {
          app.beforeStart(startAction);
        };

        expect(addBeforeStart).not.to.throw(Error);
        expect(app._beforeStartActions[0]).to.equal(startAction);
      });

      it('should not throw exception if the args is a function', function() {
        let startAction = function() {};
        let addBeforeStart = function() {
          app.beforeStart(startAction);
        };

        expect(addBeforeStart).not.to.throw(Error);
        expect(app._beforeStartActions[0]).to.equal(startAction);
      });

      it('should return app if the args is promise or function', function() {
        let actionA = Promise.resolve('Im ok');
        let actionB = Promise.reject('Im fail');
        let actionC = new Promise(function() {}); // pendding
        let actionD = function () {return 1};
        let actionE = function () {return Promise.resolve('Im another ok');};

        expect(
          app.beforeStart(actionA).
            beforeStart(actionB).
            beforeStart(actionC).
            beforeStart(actionD).
            beforeStart(actionE)
        ).to.equal(app);
      });
    });

    describe('app.start', function() {
      beforeEach(function() {
        sinon.stub(app, 'listen');
      });
      afterEach(function() {
        app.listen.restore();
      });

      it('beforeStart function should run before app.listen', function() {
        let startActionA = sinon.stub().returns(Promise.resolve(1));
        let startActionB = sinon.stub().returns(1);

        app.beforeStart(startActionA);
        app.beforeStart(startActionB);

        expect(app._beforeStartActions).to.deep.equal([startActionA, startActionB]);

        app.start();
        expect(startActionA.calledBefore(startActionB)).to.be.true;
        expect(startActionB.calledBefore(app.listen)).to.be.true;
      });

      it('should not start if some promise fail', function(done) {
        let promiseA = Promise.resolve('Im ok');
        let promiseB = Promise.reject('Im fail');

        sinon.spy(console, 'error');
        app.beforeStart(promiseA).beforeStart(promiseB).start().then(function() {
          expect(console.error.calledWith('执行app.beforeStart时出现错误, app启动失败: Im fail')).to.be.true;
          console.error.restore();
          done();
        });
      });
    });
  });
});
