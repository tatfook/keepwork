'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')
const i18nDomainLabel = require('./i18nDomainLabel')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  KEEPWORK_API_PREFIX: `"https://stage${i18nDomainLabel('-')}.keepwork.com/api/wiki/models"`,
  LESSON_API_PREFIX: `"http://lesson.keepwork.com/"`,
  GITLAB_API_PREFIX: `"https://git-stage${i18nDomainLabel('-')}.keepwork.com"`,
  ES_GATEWAY_BASE_URL: `"https://api-stage${i18nDomainLabel('-')}.keepwork.com/es"`
})
