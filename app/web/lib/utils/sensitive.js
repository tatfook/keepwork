import { sensitiveWord } from '@/api'
import { Message } from 'element-ui'
import { locale } from '@/lib/utils/i18n'

const inputIsSensitiveEn = 'The content you entered does not comply with Internet security regulations, please modify'
const inputIsSensitiveZh = '您输入的内容不符合互联网安全规范，请修改'

export const checkSensitiveWords = async function({ checkedWords }) {
  let result = await sensitiveWord.checkSensitiveWords(checkedWords)
  result && result.length > 0 && Message({
    type: 'error',
    message: locale === 'en-US' ? inputIsSensitiveEn : inputIsSensitiveZh
  })
  console.error(result)
  return result
}

export default {
  checkSensitiveWords
}
