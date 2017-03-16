'use strict';

let expect = require('chai').expect;
let env = require('../../env');

describe('controllers feature', function() {
  let app = require(env.koa800Root)(env.testAppRoot);

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
