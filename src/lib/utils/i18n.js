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

export default {
  locale,
  messages
}
