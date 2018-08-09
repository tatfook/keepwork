import _ from 'lodash'
import Parser from '@/lib/mod/parser'

const getters = {
  studentPackageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  lessonContent: state => lessonId => _.get(state.lessons, lessonId),
  lessonContentFormat: (state, { lessonContent }) => lessonId =>
    Parser.buildBlockList(lessonContent(lessonId)),
  lessonQuiz: (state, { lessonContentFormat }) => lessonId =>
    lessonContentFormat(lessonId).filter(item => item.cmd === 'Quiz')
}
export default getters
