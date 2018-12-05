#!/usr/bin/env node

const { readFileSync, writeFileSync } = require('fs')
const { resolve } = require('path')
const tests = require('openapi-samples')
const template = require('lodash.template')

const tools = require('./tools.json')

const TEMPLATE = readFileSync(resolve(__dirname,'./template.md'), 'utf8')
const TARGET = process.argv[2]

const compiled = template(TEMPLATE)

writeFileSync(TARGET, compiled({ tools, tests }))
