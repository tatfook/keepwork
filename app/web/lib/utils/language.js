import { locale } from '@/lib/utils/i18n'

const LANG_DICT = {
  'zh': 'zh-cn',
  'en': 'en'
}

const switchLanguage = (language = 'zh') => {
  if (/zh/ig.test(language)) {
    language = 'zh'
  }
  if (/en/ig.test(language)) {
    language = 'en'
  }
  window.localStorage.setItem('keepwork-language-locale', LANG_DICT[language])
  window.location.href = window.location.href.replace(/lang=.*?&|lang=.*/i, '')
}

const switchTo = lang => {
  if (!lang || !/en|zh/ig.test(lang)) {
    return
  }
  if (/zh/ig.test(lang) && /zh/ig.test(locale)) {
    return
  }
  if (/en/ig.test(lang) && /en/ig.test(locale)) {
    return
  }
  switchLanguage(lang)
}

export default {
  switchTo,
}