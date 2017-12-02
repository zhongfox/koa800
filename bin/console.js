#!/usr/bin/env node --harmony
'use strict';

let projectName = process.cwd().split('/').pop();
let startModule = require('path').join(process.cwd(), 'app');

require(startModule);

let repl = require('repl').start('koa800> ');
require('repl.history')(repl, `${process.env.HOME}/.${projectName}_history`);
