const generate = require('project-name-generator')
const crypto = require('crypto')
const { resolve } = require('path')

// process.env.BASE_URL = './'

process.env.VUE_APP_VERSION = require('./package').version
process.env.VUE_APP_TIME = Date.now()
process.env.VUE_APP_NAME = generate().dashed
process.env.VUE_APP_NONCE_VUETIFY = crypto.randomBytes(16).toString('base64')

process.env.VUE_APP_WEBPACK = true

process.env.VUE_APP_FEATURE_DIALOG_HEADERS = true
process.env.VUE_APP_FEATURE_DIALOG_METHODS = true
process.env.VUE_APP_FEATURE_DIALOG_STATUSES = true
process.env.VUE_APP_FEATURE_PAGE_HEADERS = true
process.env.VUE_APP_FEATURE_PAGE_METHODS = true
process.env.VUE_APP_FEATURE_PAGE_STATUSES = true
process.env.VUE_APP_FEATURE_PAGE_STATS = true
process.env.VUE_APP_FEATURE_PAGE_ABOUT = true
process.env.VUE_APP_FEATURE_PAGE_ABOUT_KEYBOARD = true
process.env.VUE_APP_FEATURE_GITHUB = true
process.env.VUE_APP_FEATURE_EDIT = true
process.env.VUE_APP_FEATURE_DIRECTORY = true
process.env.VUE_APP_FEATURE_EDITOR = true
process.env.VUE_APP_FEATURE_MARKDOWN = true
process.env.VUE_APP_FEATURE_HIGHLIGHT = true

module.exports = {
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add(resolve('.'))

    config
      .plugin('define')
      .tap(() => {
        return [
          Object.entries(process.env)
            .filter(({ 0: k }) => k === 'NODE_ENV' || k === 'BASE_URL' || k.startsWith('VUE_APP_'))
            .reduce((acc, { 0: k, 1: v }) => {
              acc[`process.env.${k}`] = JSON.stringify(v)
              return acc
            }, {})
        ]
      })

    config.module
      .rule('svg').uses.clear()

    config.module
      .rule('svg')
      .use('raw-loader')
      .loader('raw-loader')

    config.entry('app').clear().add('./src/index.js')

    config
      .output
      .globalObject('this')
  },

  baseUrl: './',

  devServer: {
    disableHostCheck: true,
    compress: true
  },

  productionSourceMap: false,

  css: {
    extract: false
  }
}
