'use strict';

let expect = require('chai').expect;
let sinon = require('sinon');
let env = require('../../env');
let path = require('path');

let project;
let app;
// let targetFeature;


describe('redis feature', function() {
  before(function() {
    sinon.stub(env.Project.prototype, 'getKoa800Config').returns({redis: true});
  });
  after(function() {
    env.Project.prototype.getKoa800Config.restore();
  });

  describe('#setup', function() {
    beforeEach(function() {
      project = new env.Project(env.testScaffoldRoot);
    });

    it('should contain dependencies co-redis and ioredis', function() {
      let packageJson = project.scaffoldGenerator.getPackageJson();
      expect(packageJson.dependencies).to.have.property('ioredis');
    });

    afterEach(function() { // TODO
      project.getFeature('base').scaffold.forEach(scaffold => {
        require('rimraf').sync(path.join(env.testScaffoldRoot, scaffold));
      });
    });
  });

  describe('#run', function() {
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
    });

    it('should create redis client for app', function() {
      expect(app.redis).to.have.property('master');
      expect(app.redis.master.raw).to.be.instanceof(require('ioredis'));
    });
  });
});
