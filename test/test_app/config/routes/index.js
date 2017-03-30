'use strict';

let router = require('koa-router')();
let c = require('../../app').controllers;

router.get('/action_1_in_demo', c.demo.action_1_in_demo);

module.exports = router;

