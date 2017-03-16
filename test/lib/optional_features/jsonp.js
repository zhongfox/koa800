'use strict';

let expect = require('chai').expect;
let env = require('../../env');

describe('jsonp feature', function() {
  describe('packageJson', function() {
    it('should contain dependencies koa-safe-jsonp', function() {
      let Feature = env.Feature;
      Feature.setRoot(env.testScaffoldRoot);
      let packageJson = Feature.getPackageJson();
      expect(packageJson.dependencies).to.have.property('koa-safe-jsonp');
    });
  });

  describe('enhance', function() {
    it('TODO', function() {
    });
  });
});
