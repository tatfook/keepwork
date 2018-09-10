'use strict'
const { i18nDomainLabel, IS_GLOBAL_VERSION } = require('./i18n')

module.exports = {
  BUILD_VERSION: `"${new Date().toString().split(' ').splice(0, 6).join('_').replace(/:|\+/g,'_')}"`,
  NODE_ENV: '"production"',
  KEEPWORK: `"https://keepwork.com"`,
  KEEPWORK_API_PREFIX: `"https://${i18nDomainLabel('', '.')}keepwork.com/api/wiki/models"`,
  GITLAB_API_PREFIX: `"https://git${i18nDomainLabel('-')}.keepwork.com"`,
  GATEWAY_BASE_URL: `"https://api${i18nDomainLabel('-')}.keepwork.com"`,
  ES_GATEWAY_BASE_URL: `"https://api${i18nDomainLabel('-')}.keepwork.com/es"`,
  STORAGE_GATEWAY_BASE_URL: `"https://api${i18nDomainLabel('-')}.keepwork.com/storage/v0"`,
  LESSON_API_PREFIX: `"https://api${i18nDomainLabel('-')}.keepwork.com/lesson/v0"`,
  ES_INDEX: `"default_kw_pages"`,
  ES_TYPE: `"pages"`,
  IS_GLOBAL_VERSION: `"${IS_GLOBAL_VERSION ? 'true' : ''}"`,
  PARACRAFT: `"https://www.paracraft.cn"`,
  QQ_URL: `"http://wpa.qq.com"`,
  BOARD: `"https://keepwork.com/wiki/wikieditor/board.html?"`
}
