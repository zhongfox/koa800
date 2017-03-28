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
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(helper.testScaffoldRoot, scaffold));
      });
      helper.restorePackage();
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(helper.koa800Root)(helper.testAppRoot);
    });
    it('expect app.controllers has action filters.checkReferer', function() {
      expect(app.controllers).to.have.property('filters');
      expect(app.controllers.filters).to.have.property('checkReferer');
    });
  });
});
