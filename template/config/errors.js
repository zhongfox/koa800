module.exports =  [
  'UncaughtException',     // 顶级未捕获的错误
  'DealRecommenderError',  // 推荐接口错误
  'T8sParseError',         // t8s 解析错误
  'CallRailsError',        // 调用rails接口错误
  'MissFromUrlError',      // no from url
  'MissJsonError',         // json返回个数不够
  'ThriftTimeoutError',    // thrift调用超时
  'ThriftOtherError',      // thrift调用其他错误
  'SolrServiceError',      // solr接口错误
  'SearchHttpError',       // 搜索http接口错误
  'NotFoundError',         // 各种逻辑层404错误
  'UserInfoRedirectError', // UserInfo重定向
  'cornerMarkError',       // 角标服务http接口错误
];
