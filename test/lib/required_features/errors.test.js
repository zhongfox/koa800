'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let path = require('path');

describe('errors feature', function() {
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
      let scaffold = [
        'config/errors.js',
      ];
      let scaffoldPaths = scaffold.map(scaffold => {
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

    it('expect app.errors has 2 error class', function() {
      expect(app.errors).to.have.property('NetFTError');
      expect(app.errors).to.have.property('NotFoundError');
    });

    it('expect all app.errors are inherit from Error ', function() {
      expect(app.errors.NetFTError.super_).to.equal(Error);
      expect(app.errors.NotFoundError.super_).to.equal(Error);
    });
  });
});
