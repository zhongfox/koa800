'use strict';

let merge = require('merge-util');
module.exports = function* bodyParser(next) {
  this.params = merge({}, this.query);
  if (this.request.method == 'POST') {
    merge(this.params, this.request.body);
  }
  yield next;
};
