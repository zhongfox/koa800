'use strict';

let expect = require('chai').expect;
let helper = require('../../test_helper');
let path = require('path');

let project;
let app;
let targetFeature;

describe('controllers feature', function() {
  describe('#setup', function() {
    beforeEach(function() {
      project = new helper.Project(helper.testScaffoldRoot);
      targetFeature = project.getFeature('controllers');
    });

    it('should copy scaffold', function(done) {
      let scaffoldPaths = targetFeature.scaffold.map(scaffold => {
        return path.join(helper.testScaffoldRoot, scaffold);
      });

      project.setup().then(function() {
        helper.isAllExists(scaffoldPaths).then(function(allExists) {
          allExists ? done() : done(new Error('copy scaffold faild'));
        });
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
