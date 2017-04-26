'use strict';

let expect = require('chai').expect;
let helper = require('../../test_helper');
let app;

describe('utils feature', function() {
  describe('#run', function() {
    beforeEach(function() {
      app = require(helper.koa800Root)(helper.testAppRoot);
    });

    it('app.settings should have imago_conf', function() {
      expect(app.utils).to.have.property('netFT');
      expect(app.utils).to.have.property('getRequestIp');
      expect(app.utils).to.have.property('fileUtil');
    });
  });
});
