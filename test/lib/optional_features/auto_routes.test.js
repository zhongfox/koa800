'use strict';

let expect = require('chai').expect;
let helper = require('../../test_helper');
let sinon = require('sinon');
let path = require('path');

let project;
let app;
let targetFeature;

describe('auto_routes feature', function() {
  before(function() {
    sinon.stub(helper.Project.prototype, 'getKoa800Config').returns({auto_routes: true});
  });
  after(function() {
    helper.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup ', function() {
    let packageJsonPath = path.join(helper.testScaffoldRoot, 'package.json');
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
      targetFeature = project.getFeature('auto_routes');
    });

    it('should contain dependencies koa-sub-domain', function(done) {
      project.setup().then(function() {
        let packageJson = require(packageJsonPath);
        expect(packageJson.dependencies).to.have.property('koa-sub-domain');
        done();
      });
    });

    afterEach(function() {
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(helper.testScaffoldRoot, scaffold));
      });
      helper.restorePackage();
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      //app = require(helper.koa800Root)(helper.testAppRoot);
      app = require(path.join(helper.testAppRoot, 'app'));
      sinon.spy(app, 'use');
    });

    afterEach(function() {
      app.use.restore();
    });

    it('expect app call the index router', function() {
      targetFeature.run(app);
      let indexRouter = sinon.match(function (value) {
        let path = value.router.stack[0].path;
        let action = value.router.stack[0].stack[0];
        return path === '/action_1_in_demo' && action === app.controllers.demo.action_1_in_demo
      });
      expect(app.use.calledWithExactly(indexRouter)).to.be.true;

    });

    it('expect app call the search router', function() {
      // TODO
    });

  });
});
