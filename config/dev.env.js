'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KEEPWORK_API_PREFIX: '"https://stage.keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"https://git.stage.keepwork.com"',
  ELASTICSEARCH_BASE_URL: '"httpss://es.keepwork.com/api/v0/"',
  QINIU_SERVICE_BASE_URL: '"https://es.keepwork.com/api/v0/"'
})
