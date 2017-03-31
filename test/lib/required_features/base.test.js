'use strict';

let expect = require('chai').expect;
let path = require('path');
let helper = require('../../test_helper');

let project;
let app;
let targetFeature;

describe('base feature', function() {
  describe('setup', function() {
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
      targetFeature = project.getFeature('base');
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

    it('should contain scripts start and c', function(done) {
      project.setup().then(function() {
        let packageJsonPath = path.join(helper.testScaffoldRoot, 'package.json');
        let packageJson = require(packageJsonPath);
        expect(packageJson.scripts).to.have.property('start');
        expect(packageJson.scripts).to.have.property('c'); // TODO 异常不好查
        done();
      });
    });

    afterEach(function() {
      targetFeature.scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(helper.testScaffoldRoot, scaffold));
      });
      helper.restorePackage();
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(helper.koa800Root)(helper.testAppRoot);
    });

    it('app.requireModule should return the same module as require', function() {
      expect(app.requireModule('package')).to.equal(
        require(path.join(__dirname, '../../test_app/package')));
    });

    it('app.isDevelopment() should return true by default', function() {
      expect(app.isDevelopment()).to.be.true;
    });

    it('app.isProduction() should return true when app.env=production', function() {
      app.env = 'production';
      expect(app.isProduction()).to.be.true;
    });
  });
});
