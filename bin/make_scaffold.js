#!/usr/bin/env node
'use strict';

let appRoot = process.cwd();
let ScaffoldMaker = require('../lib/scaffold_maker');

new ScaffoldMaker(appRoot).make();
