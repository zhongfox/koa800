'use strict';

let router = require('koa-router')();
let c = require('../../app').controllers;

router.get('/action_1_in_search', c.deal.action_1_in_search);

module.exports = router;

