'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let sinon = require('sinon');
let path = require('path');

let project;
let app;
// let targetFeature;

describe('jsonp feature', function() {
  before(function() {
    sinon.stub(env.Project.prototype, 'getKoa800Config').returns({jsonp: true});
  });
  after(function() {
    env.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup ', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
    });

    it('should contain dependencies koa-safe-jsonp', function() {
      let packageJson = project.scaffoldGenerator.getPackageJson();
      expect(packageJson.dependencies).to.have.property('koa-safe-jsonp');
    });

    afterEach(function() { // TODO
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(env.testScaffoldRoot, scaffold));
      });
    });
  });

  describe('#run', function() {
    it('TODO', function() {
    });
  });
});
