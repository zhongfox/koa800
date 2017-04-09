'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let helper = require('../../test_helper');
let path = require('path');

let project;
let app;
// let targetFeature;


describe('redis feature', function() {
  before(function() {
    sinon.stub(helper.Project.prototype, 'getKoa800Config').returns({redis: true});
  });
  after(function() {
    helper.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup', function() {
    let packageJsonPath = path.join(helper.testScaffoldRoot, 'package.json');
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
    });

    it('should contain dependencies co-redis and ioredis', function(done) {
      project.setup().then(function() {
        let packageJson = require(packageJsonPath);
        expect(packageJson.dependencies).to.have.property('ioredis');
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

    it('should create redis client for app', function() {
      expect(app.redis).to.have.property('master');
      expect(app.redis.master.raw).to.be.instanceof(require('ioredis'));
    });
  });
});
