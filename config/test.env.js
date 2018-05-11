'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  KEEPWORK_API_PREFIX: '"http://stage.keepwork.com/api/wiki/models"',
  GITLAB_API_PREFIX: '"http://git.stage.keepwork.com"',
  ELASTICSEARCH_BASE_URL: '"http://es.keepwork.com/api/v0/"',
  QINIU_SERVICE_BASE_URL: '"http://es.keepwork.com/api/v0/"'
})
