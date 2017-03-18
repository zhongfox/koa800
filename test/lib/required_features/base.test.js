'use strict';

require('chai').should();
let path = require('path');
let env = require('../../env');

describe('base feature', function() {
  beforeEach(function() {
    env.Feature.features = null; // 重新加载
    env.Feature.optional = {};
  });
  describe('make_scaffold ', function() {
    let scaffoldMaker;
    beforeEach(function() {
      scaffoldMaker = new env.ScaffoldMaker(env.testScaffoldRoot);
    });

    it('should copy scaffold', function(done) {
      let scaffoldPaths = ['app', 'config'].map(scaffold => {
        return path.join(env.testScaffoldRoot, scaffold);
      });

      scaffoldMaker.make().then(function() {
        env.isAllExists(scaffoldPaths).then(function(allExists) {
          allExists ? done() : done(new Error('copy scaffold faild'));
        });
      });
    });

    afterEach(function() {
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'app'));
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'config'));
    });
  });

  describe('#enhance', function() {
    let app;
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
