import _ from 'lodash'
import { locale } from '@/lib/utils/i18n'
const DEFAULT_LANG = 'zh-CN'

export default {
  getPrefix(lang) {
    lang = lang || locale

    if (lang !== DEFAULT_LANG) return 'en'
  },
  getLangColumn(col, lang) {
    const prefix = this.getPrefix(lang)
    return prefix ? prefix + _.upperFirst(col) : col
  },
  getLangValue(table, col, lang) {
    return table[this.getLangColumn(col, lang)] || table[col]
  }
}
