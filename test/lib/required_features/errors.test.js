'use strict';

let expect = require('chai').expect;
let helper = require('../../test_helper');
let path = require('path');

let project;
let app;
let targetFeature;

describe('errors feature', function() {
  describe('setup', function() {
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
      targetFeature = project.getFeature('errors');
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

    it('expect app.errors has 2 error class', function() {
      expect(app.errors).to.have.property('NetFTError');
      expect(app.errors).to.have.property('NotFoundError');
    });

    it('expect all app.errors are inherit from Error ', function() {
      expect(app.errors.NetFTError.super_).to.equal(Error);
      expect(app.errors.NotFoundError.super_).to.equal(Error);
    });
  });
});
