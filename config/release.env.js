'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const { i18nDomainLabel } = require('./i18n')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KEEPWORK_API_PREFIX: `"https://release${i18nDomainLabel('-')}.keepwork.com/api/wiki/models"`,
  LESSON_API_PREFIX: `"http://lesson.keepwork.com/"`,
  GITLAB_API_PREFIX: `"https://git-release${i18nDomainLabel('-')}.keepwork.com"`,
  GATEWAY_BASE_URL: `"https://api-release${i18nDomainLabel('-')}.keepwork.com"`,
  ES_GATEWAY_BASE_URL: `"https://api-release${i18nDomainLabel('-')}.keepwork.com/es"`,
  STORAGE_GATEWAY_BASE_URL: `"https://api-release${i18nDomainLabel('-')}.keepwork.com/storage/v0"`,
  ES_INDEX: `"test_kw_pages"`,
  ES_TYPE: `"pages"`
})
