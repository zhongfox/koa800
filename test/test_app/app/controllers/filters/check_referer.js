'use strict';

let URL = require('url');
let refererMatcher = /(zhe800|tuan800|tuan800-inc).com/;

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
