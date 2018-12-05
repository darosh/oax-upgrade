#!/usr/bin/env node

const schemaBundler = require('json-schema-bundler')
const yaml = require('yaml-js')
const axios = require('axios')
const circularJson = require('circular-json')
const compactJson = require('json-stringify-pretty-compact')
const { writeFileSync } = require('fs')
const { URL } = require('url')

const TARGET = process.argv[2]

global.URL = URL

const url = 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/master/schemas/v2.0/schema.json'
const schema = new schemaBundler.Schema(url, null, yaml.load, axios.get)

schema.load().then(() => {
  schema.bundle()
  schema.deref(true, true)
  delete schema.bundled.definitions['http:']
  writeFileSync(TARGET, compactJson(JSON.parse(circularJson.stringify(schema.bundled)), {maxLength: 120}))
}).catch(err => console.log(err))
