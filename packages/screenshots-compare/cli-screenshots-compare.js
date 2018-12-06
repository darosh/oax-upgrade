#!/usr/bin/env node

// eslint-disable-next-line no-global-assign
require = require('esm')(module)
module.exports = require('./main.js').compare(process.argv[2], process.argv[3])
