const FormChoice = () => import('./FormChoice')
const FormEssay = () => import('./FormEssay')
const FormText = () => import('./FormText')

const compMap = {
  0: FormChoice,
  1: FormChoice,
  2: FormEssay,
  3: FormText,
  4: FormText,
}

export const getCompByType = type => {
  if (compMap[type]) return compMap[type]()
}

export default {
  getCompByType,
}
