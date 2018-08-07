import _ from 'lodash'
import Parser from '@/lib/mod/parser'

const getters = {
  studentPackageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  lessonContent: state => lessonId => _.get(state.lessons, lessonId),
  lessonContentFormat: (state, { lessonContent }) => lessonId =>
    Parser.buildBlockList(lessonContent(lessonId)),
  userSubscribeList: state => state.userSubscribeList,
  userSkillsList: state => state.userSkillsList
}
export default getters
