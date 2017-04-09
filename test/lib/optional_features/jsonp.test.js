'use strict';

let expect = require('chai').expect;
let helper = require('../../test_helper');
let sinon = require('sinon');
let path = require('path');

let project;
let app;
let targetFeature;

describe('jsonp feature', function() {
  before(function() {
    sinon.stub(helper.Project.prototype, 'getKoa800Config').returns({jsonp: true});
  });
  after(function() {
    helper.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup ', function() {
    let packageJsonPath = path.join(helper.testScaffoldRoot, 'package.json');
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
      targetFeature = project.getFeature('jsonp');
    });

    it('should contain dependencies koa-safe-jsonp', function(done) {
      project.setup().then(function() {
        let packageJson = require(packageJsonPath);
        expect(packageJson.dependencies).to.have.property('koa-safe-jsonp');
        done();
      });
    });

    it('should copy scaffold', function(done) {
      let scaffoldPaths = targetFeature.scaffold.map(scaffold => {
        return path.join(helper.testScaffoldRoot, scaffold);
      });

      project.setup().then(function() {
        helper.isAllExists(scaffoldPaths).then(function(allExists) {
          allExists ? done() : done(new Error('copy scaffold faild'));
        });
      });
    });

    afterEach(function() {
      project.teardownRequiredFeatures();
    });
  });

  describe('#run', function() {
    let jsonpSpy;
    beforeEach(function() {
      let proxyquire =  require('proxyquire');
      jsonpSpy = sinon.spy();
      let jsonpLib = path.join(helper.koa800Root, 'lib/optional_features/jsonp.js');
      targetFeature = proxyquire(jsonpLib, {'koa-safe-jsonp': jsonpSpy});

      require.cache[jsonpLib] = {
        id: jsonpLib,
        filename: jsonpLib,
        loaded: true,
        exports: targetFeature
      };
    });

    it('expect app.controllers has action filters.checkReferer', function() {
      app = require(helper.koa800Root)(helper.testAppRoot);
      expect(app.controllers).to.have.property('filters');
      expect(app.controllers.filters).to.have.property('checkReferer');
    });

    it('expect koa-safe-jsonp to be called with app', function() {
      app = require(helper.koa800Root)(helper.testAppRoot);
      expect(jsonpSpy.calledWithExactly(app)).to.be.true;
    });

    it('expect koa-safe-jsonp to be called with app and config', function() {
      let config = {
        callback: '_callback',
        limit: 50
      };

      helper.Project.prototype.getKoa800Config.restore();
      sinon.stub(helper.Project.prototype, 'getKoa800Config').returns({'jsonp': config});

      app = require(helper.koa800Root)(helper.testAppRoot);
      expect(jsonpSpy.calledWithExactly(app, config)).to.be.true;
    });
  });
});
