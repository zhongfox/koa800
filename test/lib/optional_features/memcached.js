'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let env = require('../../env');

let project;
let app;
// let targetFeature;

describe('memcached feature', function() {
  before(function() {
    sinon.stub(env.Project.prototype, 'getKoa800Config').returns({memcached: true});
  });
  after(function() {
    env.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup ', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
    });

    it('should contain dependencies co-memcache', function() {
      let packageJson = project.scaffoldGenerator.getPackageJson();
      expect(packageJson.dependencies).to.have.property('co-memcached');
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
    });

    it('should create memcached client for app', function() {
      expect(app).to.have.property('cache');
      expect(app.cache).to.be.instanceof(require('co-memcached'));
    });
  });
});
