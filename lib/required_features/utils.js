'use strict';

let Feature = require('../feature');

let run = function(app) {
  app.utils = {};

  app.utils.getRequestIp = require('../utils/get_request_ip');
  app.utils.fileUtil     = require('../utils/file_util');
  app.utils.netFT        = require('../utils/net_ft');
  app.netFT              = app.utils.netFT; // 兼容老版本

  require('../utils/date_format');
  require('../utils/url_protocol_adapter');
};

module.exports = new Feature({
  run: run
});
