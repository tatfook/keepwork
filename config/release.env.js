'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KEEPWORK_API_PREFIX: '"http://release.keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"http://git.release.keepwork.com"'
})
