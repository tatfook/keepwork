'use strict'
const merge = require('webpack-merge')
const devEnv = require('./dev.env')
const { i18nDomainLabel } = require('./i18n')

module.exports = merge(devEnv, {
  NODE_ENV: '"testing"',
  KEEPWORK: `"https://keepwork.com"`,
  KEEPWORK_API_PREFIX: `"https://stage${i18nDomainLabel('-')}.keepwork.com/api/wiki/models"`,
  GITLAB_API_PREFIX: `"https://git-stage${i18nDomainLabel('-')}.keepwork.com"`,
  GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com"`,  
  ES_GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com/es"`,
  STORAGE_GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com/storage/v0"`,
  ES_INDEX: `"test_kw_pages"`,
  ES_TYPE: `"pages"`
})
