'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let path = require('path');

let project;
let app;
let targetFeature;

describe('errors feature', function() {
  describe('setup', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
      targetFeature = project.getFeature('errors');
    });

    it('should copy scaffold', function(done) {
      let scaffoldPaths = targetFeature.scaffold.map(scaffold => {
        return path.join(env.testScaffoldRoot, scaffold);
      });

      project.setup().then(function() {
        env.isAllExists(scaffoldPaths).then(function(allExists) {
          allExists ? done() : done(new Error('copy scaffold faild'));
        });
      });
    });

    afterEach(function() {
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(env.testScaffoldRoot, scaffold));
      });
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
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
