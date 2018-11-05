import { sensitiveWord } from '@/api'

export const checkSensitiveWords = async ({ checkedWords }) => {
  let result = await sensitiveWord.checkSensitiveWords(checkedWords)
  return result
}

export default {
  checkSensitiveWords
}
