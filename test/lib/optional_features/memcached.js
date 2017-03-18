'use strict';

let expect = require('chai').expect;
let env = require('../../env');

describe('memcached feature', function() {
  beforeEach(function() {
    env.Feature.features = null; // 强制重新加载
    env.Feature.optional = {memcached: true};
  });

  describe('make_scaffold ', function() {
    let scaffoldMaker;
    beforeEach(function() {
      scaffoldMaker = new env.ScaffoldMaker(env.testScaffoldRoot);
    });

    it('should contain dependencies co-memcache', function() {
      let scaffoldMaker = new env.ScaffoldMaker(env.testScaffoldRoot);
      let packageJson = scaffoldMaker.getPackageJson();
      expect(packageJson.dependencies).to.have.property('co-memcached');
    });
  });

  describe('#enhance', function() {
    let app;
    beforeEach(function() {
      app = require(env.koa800Root)(env.testAppRoot);
    });

    it('should create memcached client for app', function() {
      expect(app).to.have.property('cache');
      expect(app.cache).to.be.instanceof(require('co-memcached'));
    });
  });
});
