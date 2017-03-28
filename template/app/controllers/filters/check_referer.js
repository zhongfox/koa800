'use strict';

let URL = require('url');
let refererMatcher = /(zhe800|tuan800|tuan800-inc).com/; // TODO 使用自定义的正则

exports.checkReferer = function(req, res, next) {
  let referer = req.header('Referer');

  if (!referer) return res.status(401).json({status: 0, msg: '请求来源非法'});

  let url = URL.parse(referer, true);

  if(url.host.match(refererMatcher)) {
    next();
  } else {
    res.status(401).json({status: 0, msg: '请求来源非法'});
  }
};
