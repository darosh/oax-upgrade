#!/usr/bin/env node

const { writeFileSync } = require('fs')
const { resolve } = require('path')
const SOURCE = process.argv[2]
const TARGET = process.argv[3]
const { dependencies } = require(resolve(SOURCE))

Object.keys(dependencies).forEach(d => {
  if (d[0] === '@' || (dependencies[d].startsWith('github:') === 0)) {
    delete dependencies[d]
  } else {
    dependencies[d] = dependencies[d].replace('^', '').replace(/(.*)\.[^.]+/, '$1')
  }
})

writeFileSync(TARGET, JSON.stringify(dependencies, null, 2))
