import zhCN from './i18n/zh-CN.json'
import enUS from './i18n/en-US.json'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export const messages = {
  'zh-CN': { ...zhLocale, ...zhCN },
  'en-US': { ...enLocale, ...enUS }
}

export const locale = (navigator.language || 'zh-CN')

export default {
  locale,
  messages
}
