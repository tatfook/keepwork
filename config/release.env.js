'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KEEPWORK_API_PREFIX: '"https://release.keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"https://rlsapi.keepwork.com/git"',
  ES_GATEWAY_BASE_URL: '"https://rlsapi.keepwork.com/es"'
})
