const TypeText = { 1: '1个月', 2: '2个月', 5: '3个月', 6: '半年', 7: '1年(送3个月)' }

export const getIsFormalTypeByValue = value => {
  return value > 4
}

export const getTypeText = type => TypeText[type]

export default {
  getIsFormalTypeByValue,
  getTypeText,
}
