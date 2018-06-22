'use strict'
const i18nDomainLabel = require('./i18nDomainLabel')

module.exports = {
  BUILD_VERSION: `"${new Date().toString().split(' ').splice(0, 6).join('_').replace(/:|\+/g,'_')}"`,
  NODE_ENV: '"production"',
  KEEPWORK_API_PREFIX: `"https://${i18nDomainLabel('', '.')}keepwork.com/api/wiki/models"`,
  LESSON_API_PREFIX: `"http://lesson.keepwork.com/"`,
  GITLAB_API_PREFIX: `"https://git${i18nDomainLabel('-')}.keepwork.com"`,
  ES_GATEWAY_BASE_URL: `"https://api${i18nDomainLabel('-')}.keepwork.com/es"`,
  ES_INDEX: `"default_kw_pages"`,
  ES_TYPE: `"pages"`
}
