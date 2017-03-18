'use strict';

let expect = require('chai').expect;
let env = require('../../env');

describe('redis feature', function() {
  beforeEach(function() {
    env.Feature.features = null; // 强制重新加载
    env.Feature.optional = {redis: true};
  });

  describe('make_scaffold ', function() {
    let scaffoldMaker;
    beforeEach(function() {
      scaffoldMaker = new env.ScaffoldMaker(env.testScaffoldRoot);
    });

    it('should contain dependencies co-redis and ioredis', function() {
      let packageJson = scaffoldMaker.getPackageJson();
      expect(packageJson.dependencies).to.have.property('ioredis');
    });
  });

  describe('#enhance', function() {
    let app;
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
    });

    it('should create redis client for app', function() {
      expect(app.redis).to.have.property('master');
      expect(app.redis.master.raw).to.be.instanceof(require('ioredis'));
    });
  });
});
