
// http://keepwork.com/dreamanddead/opsway/keepwork-i18n

const KEEPWORK_LOCALE = process.env.KEEPWORK_LOCALE
const IS_GLOBAL_VERSION = KEEPWORK_LOCALE === 'en_US'
const I18N_LABEL = IS_GLOBAL_VERSION ? 'en' : ''

const i18nDomainLabel = 
  (prefix = '', postfix = '') => I18N_LABEL ? `${prefix}${I18N_LABEL}${postfix}` : ''

module.exports = {
  i18nDomainLabel,
  IS_GLOBAL_VERSION
}
