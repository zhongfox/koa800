// TODO 增加测试
'use strict';

let expect = require('chai').expect;
let helper = require('../../test_helper');
let path = require('path');
let sinon = require('sinon');
let netFT = require(path.join(helper.koa800Root, 'lib/utils/net_ft'));
let co = require('co');

describe('netFT', function() {
  it('faultTolerance should not be called if netAction is not timeout', function(done) {
    let netActionSpy = sinon.spy();
    let netAction = new Promise(function(resolve, reject) {
      setTimeout(function() {
        netActionSpy();
        resolve();
      }, 50);
    });

    let faultTolerance = sinon.spy();

    co(function* () {
      yield netFT(netAction, faultTolerance, {timeout: 100, plain: true});
    }).then(function() {
      expect(netActionSpy.called).to.be.true;
      expect(faultTolerance.called).to.be.false;
      done();
    }).catch(function(e) {
      done(e);
    });
  });

  it('faultTolerance should be called if netAction is timeout', function(done) {
    let netActionSpy = sinon.spy();
    let netAction = new Promise(function(resolve, reject) {
      setTimeout(function() {
        netActionSpy();
        resolve();
      }, 300);
    });

    let faultTolerance = sinon.spy();

    co(function* () {
      yield netFT(netAction, faultTolerance, {timeout: 100, plain: true});
    }).then(function() {
      expect(netActionSpy.called).to.be.false;
      expect(faultTolerance.called).to.be.true;
      done();
    }).catch(function(e) {
      done(e);
    });
  });
});
