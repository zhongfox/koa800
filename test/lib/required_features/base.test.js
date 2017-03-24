'use strict';

require('chai').should();
let path = require('path');
let env = require('../../env');

let project;
let app;
let targetFeature;

describe('base feature', function() {
  describe('setup', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
      targetFeature = project.getFeature('base');
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
      targetFeature.scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(env.testScaffoldRoot, scaffold));
      });
      // require('rimraf').sync(path.join(env.testScaffoldRoot, 'app'));
      // require('rimraf').sync(path.join(env.testScaffoldRoot, 'config'));
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
    });

    it('app.requireModule should return the same module as require', function() {
      app.requireModule('koa800').should.equal(
        require(path.join(__dirname, '../../test_app/koa800')));
    });

    it('app.isDevelopment() should return true by default', function() {
      app.isDevelopment().should.equal(true);
    });

    it('app.isProduction() should return true when app.env=production', function() {
      app.env = 'production';
      app.isProduction().should.equal(true);
    });
  });
});
