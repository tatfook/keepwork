'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  KEEPWORK_API_PREFIX: '"https://stage.keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"https://stgapi.keepwork.com/git"',
  ES_GATEWAY_BASE_URL: '"https://stgapi.keepwork.com/es"'
})
