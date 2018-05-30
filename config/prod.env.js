'use strict'
const i18nDomainLabel = require('./i18nDomainLabel')

module.exports = {
  BUILD_VERSION: `"${new Date().toString().split(' ').splice(0, 6).join('_').replace(/:|\+/g,'_')}"`,
  NODE_ENV: '"production"',
  KEEPWORK_API_PREFIX: `"https://${i18nDomainLabel('', '.')}keepwork.com/api/wiki/models"`,
  GITLAB_API_PREFIX: `"https://api${i18nDomainLabel('-')}.keepwork.com/git"`,
  ES_GATEWAY_BASE_URL: `"https://api${i18nDomainLabel('-')}.keepwork.com/es"`
}
