/**
 * @version 1.1 方法扩展使用Object.defineProperty方法；避免污染全局；
 */
/**
 * 将当前的对象url转换为https
 * @returns {string}
 * useage: "http://www.zhe800.com".to_https_protocol();
 */
Object.defineProperty(String.prototype, 'to_https_protocol', {
  value: function () {
    return this.trim().replace(/^http://|^///, "https://");
  }
});
/**
 * 将当前的对象url转换为http
 * @returns {string}
 */
Object.defineProperty(String.prototype, 'to_http_protocol', {
  value: function () {
    return this.trim().replace(/^https://|^///, "http://");
  }
});
/**
 * 将当前的对象url转换为//开头的url;
 * @returns {string}
 */
Object.defineProperty(String.prototype, 'to_no_protocol', {
  value: function () {
    return this.trim().replace(/^https://|^http:///, "//");
  }
});
/**
 * 自适应url转换，协议需要外部传入；
 * @param protocol 指定协议 可选值 'http','https','no' 默认值为http；
 * @returns {*}
 */
Object.defineProperty(String.prototype, 'adapt_protocol', {
  value: function (protocol) {
    if (!protocol) {
      protocol = 'http';
    }
    if (protocol == 'no') {
      return this.to_no_protocol();
    } else if (protocol == 'http') {
      return this.to_http_protocol();
    } else if (protocol == 'https') {
      return this.to_https_protocol();
    }
    return this;
  }
});
/**
 * hash对象上指定属性转换为https
 * @param properties 为数组，例如 var x = {a1: {b: {c: {d: "//www.zhe800.com"}}},"a2":"https://www.tuan800.com/","a3":[{"b2":"http://zk.hui800.net"}],"a4":34};
 * 1,调用此方法配置x.to_https_protocol(['a1.b.c.d','a2']),可以将a1.b.c.d和a2中的符合条件的url进行https协议转换，；
 * 2,对于数组类型；
 * var x = {
  a1: {b: {c: {d: "//www.zhe800.com"}},m:"//tuan800.com"},
  "a2": "https://www.tuan800.com/",
  "a3": [{"b2": "http://zk.hui800.net"}, "http://www.zhe800.com"],
  "a4": 34
};
 *var mm = ["http://zhe800.com", {a: "//www.zhe800.com"}, 35];
 *调用方式为：
 console.log(JSON.stringify(x.to_http_protocol(['a1.b.c.d','a1.m','a2', 'a3._all.b2', "a3._all"])));
 console.log(JSON.stringify(mm.to_http_protocol(['_all', "_all.a"])));
 result:
 {"a1":{"b":{"c":{"d":"http://www.zhe800.com"}},"m":"http://tuan800.com"},"a2":"http://www.tuan800.com/","a3":[{"b2":"http://zk.hui800.net"},"http://www.zhe800.com"],"a4":34}
 ["http://zhe800.com",{"a":"http://www.zhe800.com"},35]
 */
Object.defineProperty(Object.prototype, 'to_https_protocol', {
  value: function (properties) {
    return this.adapt_protocol(properties, 'https');
  }
});
/**
 * 转换为http协议；
 * @param properties
 * @see Object.to_https_protocol
 */
Object.defineProperty(Object.prototype, 'to_http_protocol', {
  value: function (properties) {
    return this.adapt_protocol(properties, 'http');
  }
});
/**
 * 转换为无协议；
 * @param properties
 * @see Object.to_https_protocol
 */
Object.defineProperty(Object.prototype, 'to_no_protocol', {
  value: function (properties) {
    return this.adapt_protocol(properties, 'no');
  }
});

Object.defineProperty(Object.prototype, 'adapt_protocol', {
  value: function (properties, protocol) {
    if (protocol && typeof protocol != 'string') {
      throw new Error(" protocol type error,must be string");
    }
    var that = this;
    properties.forEach(function (prop) {
      var ps = prop.split('.');
      var next_property = ps.shift();
      if (!next_property) {
        return;
      }
      var next_target = that[next_property];
      if (!next_target) {
        return;
      }
      if (next_target.constructor == String && ps.length == 0) {
        that[next_property] = next_target.adapt_protocol(protocol);
      } else if ([Object, Array].indexOf(next_target.constructor) != -1) {
        that[next_property] = next_target.adapt_protocol([ps.join('.')], protocol);
      }
    });
    return that;

  }
});


Object.defineProperty(Array.prototype, 'to_https_protocol', {
  value: function (properties) {
    return this.adapt_protocol(properties, 'https');
  }
});

Object.defineProperty(Array.prototype, 'to_http_protocol', {
  value: function (properties) {
    return this.adapt_protocol(properties, 'http');
  }
});
Object.defineProperty(Array.prototype, 'to_no_protocol', {
  value: function (properties) {
    return this.adapt_protocol(properties, 'no');
  }
});
Object.defineProperty(Array.prototype, 'adapt_protocol', {
  value: function (properties, protocol) {
    if (!properties || (properties && properties.constructor != Array)) {
      throw new Error("properties can not be null and type must be Array");
    }
    var that = this;
    properties.forEach(function (prop) {
      var ps = prop.split('.');
      if (ps.shift() != '_all') {
        return;
      }
      that = that.map(function (item) {
        if (typeof item == 'string' && prop == "_all") {
          return item.adapt_protocol(protocol);
        } else if (item && [Array, Object].indexOf(item.constructor) != -1) {
          return item.adapt_protocol([ps.join('.')], protocol);
        }
        return item;
      });
    });
    return that;
  }
});
