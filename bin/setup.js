#!/usr/bin/env node
'use strict';

let appRoot = process.cwd();
let Project = require('../lib/project');
let project = new Project(appRoot);

project.setup();
