'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KEEPWORK_API_PREFIX: '"https://release.keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"https://git.release.keepwork.com"',
  ES_GATEWAY_BASE_URL: '"https://stgapi.keepwork.com/es"'
})
