'use strict';

require('chai').should();
let path = require('path');
let env = require('../../env');

describe('base feature', function() {
  describe('#enhance', function() {
    let app = require(env.koa800Root)(env.testAppRoot);

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

  describe('#scaffold', function() {
    it('should copy scaffold', function(done) {
      let scaffoldPaths = ['app', 'config'].map(scaffold => {
        return path.join(env.testScaffoldRoot, scaffold);
      });

      env.Feature.makeScaffold(env.testScaffoldRoot).then(function() {
        env.isAllExists(scaffoldPaths).then(function(allExists) {
          allExists ? done() : done(new Error('copy scaffold faild'));
        });
      });
    });

    after(function() { // TODO
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'app'));
      require('rimraf').sync(path.join(env.testScaffoldRoot, 'config'));
    });
  });
});
