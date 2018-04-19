import zh_CN from './zh-CN.json'
import en_US from './en-US.json'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

export const messages = {
  'zh-CN': { ...enLocale, ...zh_CN },
  'en-US': { ...enLocale, ...en_US }
}
