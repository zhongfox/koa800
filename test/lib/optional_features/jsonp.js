'use strict';

let expect = require('chai').expect;
let env = require('../../env');

describe('jsonp feature', function() {
  beforeEach(function() {
    env.Feature.features = null; // 强制重新加载
    env.Feature.optional = {jsonp: true};
  });

  describe('make_scaffold ', function() {
    let scaffoldMaker;
    beforeEach(function() {
      scaffoldMaker = new env.ScaffoldMaker(env.testScaffoldRoot);
    });

    it('should contain dependencies koa-safe-jsonp', function() {
      let packageJson = scaffoldMaker.getPackageJson();
      expect(packageJson.dependencies).to.have.property('koa-safe-jsonp');
    });
  });

  describe('#enhance', function() {
    it('TODO', function() {
    });
  });
});
