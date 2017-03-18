'use strict';

let expect = require('chai').expect;
let env = require('../../env');
let path = require('path');

describe('controllers feature', function() {
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
      let scaffoldPaths = ['app/controllers/'].map(scaffold => {
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

    describe('加载第一层级目录中的controller文件', function() {
      it('expect app.controllers has controller demo', function() {
        expect(app.controllers).to.have.property('demo');
      });

      it('expect app.controllers.demo has 2 actions', function() {
        expect(app.controllers.demo).to.have.property('action_1_in_demo');
        expect(app.controllers.demo).to.have.property('action_2_in_demo');
      });
    });

    describe('加载第二层级目录中的controller文件', function() {
      it('expect app.controllers has controller deal', function() {
        expect(app.controllers).to.have.property('deal');
      });

      it('expect app.controllers.deal has 3 actions', function() {
        expect(app.controllers.deal).to.have.property('action_1_in_forecast');
        expect(app.controllers.deal).to.have.property('action_2_in_forecast');

        expect(app.controllers.deal).to.have.property('action_1_in_search');
      });
    });
  });
});
