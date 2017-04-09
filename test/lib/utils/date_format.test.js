'use strict';

let expect = require('chai').expect;
let helper = require('../../test_helper');
let path = require('path');
require(path.join(helper.koa800Root, 'lib/utils/date_format'));
let targetDate = new Date(2017, 0, 12, 22, 19, 35); // Thu Jan 12 2006 22:19:35

describe('Date.prototype.toFormat', function() {
  it('should format date with full pattern', function() {
    expect(targetDate.toFormat('yyyy-MM-dd hh:mm:ss')).to.equal('2017-01-12 22:19:35');
  });

  it('should format date with part pattern', function() {
    expect(targetDate.toFormat('MM-dd hh:mm:ss')).to.equal('01-12 22:19:35');
  });
});

