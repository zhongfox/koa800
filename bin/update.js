#!/usr/bin/env node
'use strict';

let appRoot = process.cwd();

require('../lib/feature').makeScaffold(appRoot);
