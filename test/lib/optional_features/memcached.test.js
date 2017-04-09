'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let helper = require('../../test_helper');
let path = require('path');

let project;
let app;
// let targetFeature;

describe('memcached feature', function() {
  before(function() {
    sinon.stub(helper.Project.prototype, 'getKoa800Config').returns({memcached: true});
  });
  after(function() {
    helper.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup ', function() {
    let packageJsonPath = path.join(helper.testScaffoldRoot, 'package.json');
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
    });

    it('should contain dependencies co-memcache', function(done) {
      project.setup().then(function() {
        let packageJson = require(packageJsonPath);
        expect(packageJson.dependencies).to.have.property('co-memcached');
        done();
      });
    });

    afterEach(function() {
      project.teardownRequiredFeatures();
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(helper.koa800Root)(helper.testAppRoot);
    });

    it('should create memcached client for app', function() {
      expect(app).to.have.property('cache');
      expect(app.cache).to.be.instanceof(require('co-memcached'));
    });
  });
});
