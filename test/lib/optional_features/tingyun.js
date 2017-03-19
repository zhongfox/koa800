'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let sinon = require('sinon');
let path = require('path');
let tingyunConfigFile = path.join(env.testScaffoldRoot, 'tingyun.json.example');

describe('tingyun feature', function() {
  beforeEach(function() {
    env.Feature.features = null; // 重新加载
    env.Feature.optional = { tingyun: true };
  });

  describe('make_scaffold ', function() {
    let scaffoldMaker;
    beforeEach(function() {
      scaffoldMaker = new env.ScaffoldMaker(env.testScaffoldRoot);
    });

    it('packageJson should contain dependencies tingyun', function() {
      let packageJson = scaffoldMaker.getPackageJson();
      expect(packageJson.dependencies).to.have.property('tingyun');
    });

    it('should copy scaffold and set default app_name', function(done) {
      scaffoldMaker.make().then(function() {
        require('fs').readFile(tingyunConfigFile, function(error, content) {
          if (error) return done(error);
          let config = JSON.parse(content);
          expect(config.app_name).to.eql(['test_scaffold']);
          done();
        });
      });
    });

    afterEach(function() {
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'app'));
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'config'));
      require('rimraf').sync(tingyunConfigFile);
    });
  });

  describe('#enhance', function() {
    let app;
    let tingyun;
    before(function() {
      process.env.TINGYUN_HOME = env.testAppRoot;
      tingyun = require('tingyun');
      sinon.spy(tingyun, 'noticeError');
      sinon.spy(tingyun, 'setWebActionName');
    });
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
    });

    it('app.monitor.noticeError should call tingyun.noticeError', function() {
      let error = new Error('fake error');
      app.monitor.noticeError(error);
      expect(tingyun.noticeError.calledWith(error, '')).to.be.true;
    });

    it('app.monitor.noticeError should turn string to error', function() {
      let errorMessage = 'fake error';
      app.monitor.noticeError(errorMessage);
      expect(tingyun.noticeError.calledWith(sinon.match.instanceOf(Error), '')).to.be.true;
    });

    it('app.monitor.noticeError should stringify customParamters', function() {
      let error = new Error('fake error');
      let customParamters = {a: 1, b: 2};
      app.monitor.noticeError(error, customParamters);
      expect(tingyun.noticeError.calledWith(error, JSON.stringify(customParamters))).to.be.true;
    });

    it('app.monitor.setTransactionName should call tingyun.setWebActionName', function() {
      app.monitor.setTransactionName('fake name');
      expect(tingyun.setWebActionName.calledWith('fake name')).to.be.true;
    });
  });
});
