'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const { i18nDomainLabel } = require('./i18n')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  HOST_ENV: '"localhost"',
  KEEPWORK_API_PREFIX: `"https://stage${i18nDomainLabel('-')}.keepwork.com/api/wiki/models"`,
  GITLAB_API_PREFIX: `"https://git-stage${i18nDomainLabel('-')}.keepwork.com"`,
  ES_GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com/es"`,
  ES_INDEX: `"www_pages_v1"`,
  ES_TYPE: `"pages"`
})
