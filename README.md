[![Build Status](https://travis-ci.org/zhongfox/koa800.svg?branch=master)](https://travis-ci.org/zhongfox/koa800)
[![Coverage Status](https://coveralls.io/repos/github/zhongfox/koa800/badge.svg?branch=master)](https://coveralls.io/github/zhongfox/koa800?branch=master)

# koa800

基于koa框架, 可扩展、可配置的中间件集合, 以及快速定制项目结构的脚手架工具.

## 1. 要解决的问题

1. 脚手架文件太多:
   * 干扰业务代码
   * 无法方便的进行更新和升级
   * 随着时间推移, 项目结构和脚手架文件在不同项目中逐渐变得不统一

2. 中间件的管理:
   * 相同的中间件需要在不同项目中去引用和配置, 重复的工作量, 重复的代码(违反DRY)
   * 不便于统一的更新和升级

---

## 2. 背景

微服务是当前比较流行的系统架构模式, 各个应用的专注于提供特定的服务. 在框架选择上, 轻量级、 支持中间件选配的koa框架是一个不错的选择.

koa 的使用非常灵活便捷, 它没有提供模板文件, 也没有要求项目结构标准, 这让开发者有很大的自由度; 不过对于同一个团队下的多个koa应用来说, 这会是一个问题: 多个项目在脚手架结构上的不统一, 将会对跨项目维护、中间件升级等造成麻烦.

解决以上问题, 有的团队会采用代码规范/项目结构规范来作为约束, 对于生命周期较长的多应用系统, 规范不一定有很好的效果, 规范毕竟是靠人来执行.

koa800提供另外一种方案: 将各项目的结构标准、共用的中间件依赖等, 提取到npm包中, 对于那些部分项目使用的中间件, 也将其提取到npm包中, 使用者可以对这部分特性进行简单的声明选择. 这样一来, 项目结构和中间件都在koa800中进行控制和装配, 实现了强制的项目标准.

同时, koa800还提供了项目脚手架的创建和更新功能.

---

## 3. Koa800 介绍

koa800提供了2个功能:

1. Scaffold Generator: 创建、更新项目脚手架, 可配置需要特性. 发生在执行setup脚本时.
2. Runtime Koa Wrapper: 统一管理项目中间件, 可配置需要特性. 发生在项目运行时.

Scaffold Generator和Koa Wrapper都是通过[Feature](TODO)进行管理.

---

### 3.1 Scaffold Generator

让我们用koa800来初始化一个新项目:

>% mkdir koa800_demo
>% cd koa800_demo

然后用`npm init`创建项目package.json

现在你需要做的是将`koa800`加入项目依赖:

>% npm install koa800 --save

现在该项目的package.json大概是这个样子的:

```javascript
{
  "name": "koa800_demo",
  "version": "1.0.0",
  "dependencies": {
    "koa800": "^1.0.0"
  }
}
```

执行koa800提供的setup脚本更新项目脚手架:

>% ./node_modules/.bin/setup

执行完毕后, 将创建类似如下的项目结构:

```
├── app/
│   └── controllers/
├── app.js
├── bin/
│   └── www
├── config/
│   ├── environments/
│   │   ├── development.js
│   │   └── production.js
│   ├── errors.js
│   ├── routes/
│   │   └── index.js
│   └── settings.js
└── package.json
```

此时查看`package.json`, 内容也有更新, 内容大概如下:

```javascript
{
  "name": "koa800_demo",
  "version": "1.0.0",
  "dependencies": {
    "koa800": "^1.0.0"
  },
  "scripts": {
    "start": "node ./bin/www",
    "c": "node ./node_modules/.bin/c",
    "setup": "node ./node_modules/.bin/setup"
  },
  "koa800Config": {
    "eslint": false,
    "jsonp": false,
    "memcached": false,
    "redis": false,
    "prepare_commit_msg": false,
    "auto_routes": false
  }
}
```

其中, koa800Config是用于声明可选feature的属性, 默认情况下, 这里列出了所有可选的features, 但设为了false, 表示不启用, 用户可以根据项目实际需要对某些feature进行开启.

在每次修改了koa800Config中的feature设置后, 需要再次执行如上的setup脚本, setup脚本会根据koa800Config中的配置去调整当前项目的脚手架和中间件.

---

### 3.2 Runtime Koa Wrapper

在上一小节中, 通过setup生成的项目入口文件是app.js, 该文件内容如下:

```javascript
'use strict';
let app = require('koa800')();
module.exports = app;
```

可以看到, 项目本身没有直接依赖和使用`koa`, 而是使用的`koa800`, `koa800`作为一个包裹器, 引用了`koa`, 同时引入并正确配置了其他一些依赖的中间件. 同脚手架生成器一样, 用户也可以在package.json的koa800Config属性中去配置需要的依赖feature.

---

## 4. 约定

koa800 的主要目的是减少项目之间的重复的项目结构代码, 保证项目的规范和统一, 并能在今后方便的进行整体调整. koa800想要避免的重复代码包括:

* 项目组织和加载的代码
* 对相同中间件的引用和配置的代码
* CI类, 工具类, 编译打包部署等代码

koa800创建的脚手架有如下约定:
```
├── app/
│   └── controllers/       控制器代码
├── app.js                 app的入口文件
├── bin/
│   └── www                项目启动文件
├── config/                项目配置文件目录
│   ├── environments/          具体环境的个性配置文件目录
│   │   ├── development.js
│   │   └── production.js
│   ├── errors.js
│   ├── routes/            路由目录
│   │   ├── index.js       任意域名路由
│   │   └── search.js      子域名路由, 子域名和文件名一致
│   └── settings.js        基础配置文件, 低优先级
│   └── settings.local.js  全局特殊配置文件, 高优先级
└── package.json
```

这些约定是由各feature的setup流程进行控制的.

---

## 5. Feature

Feature 是脚手架构建和中间件装配的基本单元, Feature分为Required和Optional2个类别, 目前的Feature如下:

| Required Features | 描述                   | Scaffold Generator                        | Runtime                                    |
|-------------------|------------------------|-------------------------------------------|--------------------------------------------|
| base              | 基础特性               | 生成项目基础脚手架, 引入基础依赖          | 引入并配置项目基本的中间件                 |
| controllers       | 控制器                 | 生成控制器目录app/controllers/            | 加载控制器, 挂载到app.controllers          |
| errors            | 错误列表               | 生成错误列表模块config/errors.js          | 加载错误列表, 挂载到app.errors             |
| settings          | 项目配置管理           | 生成多级配置管理文件                      | 按照优先级解析settings, 挂载到app.settings |
| start_hooks       | 应用启动的前置注册管理 | 不涉及                                    | 处理app.start的前置操作                    |


| Optional Features  | 描述                               | Scaffold Generator                           | Runtime                                      |
|--------------------|------------------------------------|----------------------------------------------|----------------------------------------------|
| auto_routes        | 自动路由配置                       | 引入路由和子域名的依赖                       | 加载config/routes/中的路由, 并自动匹配子域名 |
| eslint             | 引入eslint                         | 将.git/hook/pre-commit链接到指定脚本         | 不涉及                                       |
| jsonp              | 引入jsonp支持                      | 引入jsonp依赖, 并提供check referer           | 加载jsonp中间件                              |
| memcached          | 引入memcached                      | 引入memcached依赖                            | 将memcached链接挂载到app.settings.memcached  |
| prepare_commit_msg | 在git commit消息中自动集成分支信息 | 将.git/hooks/prepare-commit-ms链接到指定脚本 | 不涉及                                       |
| redis              | 引入redis                          | 引入redis依赖                                | 将redis链接挂载到app.redis                   |


以下是部分feature说明:

---

### base

feature base 按照约定创建了项目基本的结构, 同时提供了一些基础的API和脚本:

**API**

* `app.requireModule(relativePathFromRoot)`: 参数是相对于app.root的相对路径, 这个API让用户不用考虑当前脚本的位置和目标模块的层级关系, 非常方便.

* `app.isDevelopment() -> bool` `app.isProduction() -> bool` 用于判断当前执行环境的语法糖.

* `app.netFT`: 网络请求降级API

**脚本**

* `npm run setup`: 按照当前配置的koa800Config更新项目脚手架
* `npm run c`: 提供了koa800 console功能, 方便调试

![console](//zhongfox.github.io/assets/images/koa800/console.gif)

[console 演示](https://asciinema.org/a/5byh1eu1wvctx0bz6t4z2u7az)

除此之外, base feature还配置了日志, 设置了favicon.ico, 处理了Post 参数等问题.

---

### eslint

在node.js 项目中, 我们引入eslint作为代码质量控制工具. 并在git commit 时, 利用 pre-commit hook 对修改的文件自动执行eslint, 强制保证了入库代码的质量.

在 pre-commit 执行eslint检测到代码错误时, 可以配置要求阻止当前commit(默认), 也可以配置仅作为警告输出, commit仍然成功.

![eslint](//zhongfox.github.io/assets/images/koa800/eslint.gif)

[eslint 演示](https://asciinema.org/a/a2vgtj99ne2m03zczvu1vpsj4)


eslint 支持的配置项:

| 选项       | 含义                                                            |
|------------|-----------------------------------------------------------------|
| false      | 关闭 auto eslint                                                |
| true/error | 开启 auto eslint, 如eslint失败, 将阻止 git commit               |
| warning    | 开启 auto eslint, 如eslint失败, 仅输出错误消息, 允许 git commit |

---

### prepare_commit_msg

对多个开发共同维护的git仓库, 分析某个commit的作者、来源分支或者来源工单, 是一个常见的场景, 不过git commit 中只能查到作者信息, 不能很方便的追踪到来源分支. 在某些团队中是要求在commit message中手动加上当前分支名, 以满足未来分析需要, 这个工作其实可以通过git prepare-commit-msg 来自动实现.

当在koa800中开启prepare_commit_msg选项后, 每次用户commit代码, 会自动把当前分支名信息记录到commit message中.

![prepare_commit_msg](//zhongfox.github.io/assets/images/koa800/prepare_commit_msg.gif)

[prepare_commit_msg 演示](https://asciinema.org/a/1mfun5dcx6jr0jub1l7lzfd7b)

prepare_commit_msg 支持的配置项:

| 选项  | 含义                    |
|-------|-------------------------|
| false | 关闭 prepare_commit_msg |
| true  | 开启 prepare_commit_msg |

---

### settings

配置管理是项目工程结构中重要一环, koa800 的 settings feature 为项目提供了多级的配置管理:

1. 第一优先级:

    `config/settings.local.js`

    该文件不应该在git版本库, 用于开发测试或者部署环境的特殊配置, 优先级最高.

2. 第二优先级:

    `config/environments/development.js` 或 `config/environments/production.js`

    koa800会根据env的值去加载`config/environments/`中的同名js配置文件, 该目录中的配置用于不同运行环境的差异化配置.

    环境配置文件应该放入版本库.

3. 最低优先级:

    `config/settings.js`

    该文件包含项目基础配置, 优先级最低, 应该放入git版本库.


settings属于Required feature, 无需在koa800Conifg中配置.

---

### start_hooks

某些应用在启动web 服务前, 需要处理一些前置操作, 如服务注册, 配置同步, 获取静态资源hash值等. 如果任由这些需求在各个微服务中处理, 会有大量的重复代码. 该feature 提供的API `app.beforeStart` 允许用户在app.start前注册前置操作:


`app.beforeStart(action)`参数action 可以是以下值:

* 一个 Promise 实例, koa800会保证此promise resolve后, 才启动web 服务

* 一个 function, 且该function的返回值是一个Promise实例, koa800会在启动web服务前执行该function, 并且会保证此promise resolve后, 才启动web 服务.

* 一个 function, 返回值并不是Promise实例, koa800会在启动web服务前执行该function.

`app.beforeStart` 允许级联调用, 如:

```javascript
app.beforeStart(syncConfiguration).beforeStart(serviceDiscovery).beforeStart(serviceRegistration)
```

start_hooks属于Required feature, 无需在koa800Conifg中配置.

---

### auto_routes

web应用的http 路由通常由两部分组成: 子域名匹配和path匹配, [koa-sub-domain](https://www.npmjs.com/package/koa-sub-domain)和[koa-router](https://www.npmjs.com/package/koa-router) 可以实现以上功能.

如果不使用koa800, 用户需要自行配置子域名路由, 如:

```javascript
app.use(app.requireModule('config/routes').routes());                          // 泛域名路由
app.use(subdomain('last', app.requireModule('config/routes/last').routes()));  // last 子域名路由
app.use(subdomain('new', app.requireModule('config/routes/new').routes()));    // new 子域名路由
app.use(subdomain('top', app.requireModule('config/routes/top').routes()));    // top 子域名路由
```

koa800提倡约定大于配置, 只要代码按照约定组织, koa800 会完整这些重复而固定的工作, 减少用户需要编写的代码行.

在koa800, 只要将路由文件按照约定放入`config/routes`中, koa800 会自动加载路由, 并按照文件名识别子域名:

```
config
└── routes
    ├── index.js  泛域名路由
    ├── last.js   last 子域名路由
    ├── new.js    new 子域名路由
    └── top.js    top 子域名路由
```

auto_routes 支持的配置项:

| 选项  | 含义             |
|-------|------------------|
| false | 关闭 auto_routes |
| true  | 开启 auto_routes |

---

### jsonp

[koa-safe-jsonp](https://www.npmjs.com/package/koa-safe-jsonp) 提供了koa jsonp支持, koa800将其做了简单的封装.


jsonp存在较高的[安全风险](http://www.csdn.net/article/2015-07-14/2825207), referer 检查是jsnop风险防范的常见手段, koa800的jsonp feature 提供了referer 检测的验证action, 该filter位于`app/controllers/filters/check_referer.js`

使用方式:

在路由中加上前置filter: `filters.checkReferer`:

> router.get('/user_info', app.controllers.filters.checkReferer, app.controllers.user.info);

可以在`app/controllers/filters/check_referer.js`中配置特定的refererMatcher.

jsonp 支持的配置项:

| 选项     | 含义                                         |
|----------|----------------------------------------------|
| false    | 关闭 jsonp                                   |
| true     | 开启 jsonp                                   |
| 配置对象 | 开启 jsonp, 并将配置对象传递给koa-safe-jsonp |

配置对象中可以配置`callback`和`limit`, 详见[koa-safe-jsonp](https://www.npmjs.com/package/koa-safe-jsonp)

```javascript
jsonp(app, {
  callback: '_callback', // default is 'callback'
  limit: 50, // max callback name string length, default is 512
});
```

---

## 6. 开发者指南

koa800提供的所有特性单元是Feature, 开发者可以通过编写Feature按需扩展koa800的功能.

在koa800中Feature类定义如下:

```javascript
class Feature {
  constructor(properties) {
    this.run          = properties.run;
    this.setup        = properties.setup;
    this.packageJson  = properties.packageJson;
    this.scaffold     = properties.scaffold;
    this.dependencies = properties.dependencies;
  }
}
```

属性说明:

* run: 该feature在运行时对app的增强操作
* setup: 该feature在脚手架更新过程中的操作, 该属性期望是一个生成器函数
* packageJson: 该feature在脚手架更新过程中, 对项目package.json的补充, 比如引入scripts, dependencies等
* scaffold: 该feature在脚手架更新过程需要同步的文件列表
* dependencies: 该feature依赖的其他feature

Scaffold Generator 各feature的处理流程:

1. 处理dependencies features
2. 更新scaffold文件列表
3. 更新packageJson内容
4. 执行setup

运行时, 各feature的执行流程:

1. 依次执行feature.run


### 单元测试

目前koa800测试覆盖率>80%, 开发者在新增、更新feature时, 务必补充单元测试.
