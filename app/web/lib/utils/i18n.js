import Cookies from 'js-cookie'
import zhCN from './i18n/zh-CN.json'
import enUS from './i18n/en-US.json'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export const messages = {
  'zh-CN': { ...zhLocale, ...zhCN },
  'en-US': { ...enLocale, ...enUS }
}

export const locale = (() => {
  let oldVersionKeepworkLocale = localStorage['keepwork-language-locale']
  let result = oldVersionKeepworkLocale || navigator.language || 'zh-CN'
  result = /^zh/.test(result) ? 'zh-CN' : 'en-US'
  return result
})()

export const toggleLanguage = () => {
  localStorage['keepwork-language-locale'] = locale === 'zh-CN' ? 'en-US' : 'zh-CN'
  location.reload()
}

/**
 * Set cookie for lessons and other thired service providers backend use
 * lang en-US, zh-CN presents the language the frontend is using
 * locale en-US, zh-CN presents where the service is for
 */
Cookies.set('lang', locale)
const IS_GLOBAL_VERSION = !!process.env.IS_GLOBAL_VERSION
Cookies.set('locale', IS_GLOBAL_VERSION ? 'en-US' : 'zh-CN')

export default {
  locale,
  messages,
  toggleLanguage
}
