'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let sinon = require('sinon');
let path = require('path');
let tingyunConfigFile = path.join(env.testScaffoldRoot, 'tingyun.json.example');

let project;
let app;
// let targetFeature;

describe('tingyun feature', function() {
  before(function() {
    sinon.stub(env.Project.prototype, 'getKoa800Config').returns({tingyun: true});
  });
  after(function() {
    env.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
    });

    it('packageJson should contain dependencies tingyun', function() {
      let packageJson = project.scaffoldGenerator.getPackageJson();
      expect(packageJson.dependencies).to.have.property('tingyun');
    });

    it('should copy scaffold and set default app_name', function(done) {
      project.setup().then(function() {
        require('fs').readFile(tingyunConfigFile, function(error, content) {
          if (error) return done(error);
          let config = JSON.parse(content);
          expect(config.app_name).to.include('test_scaffold');
          done();
        });
      });
    });

    afterEach(function() { // TODO
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(env.testScaffoldRoot, scaffold));
      });
      require('rimraf').sync(tingyunConfigFile);
    });
  });

  describe('#run', function() {
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
