import _ from 'lodash'

const getters = {
  studentPackageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  lessonDetail: state => state.lessonDetail,
  lessonQuiz: state => state.lessonDetail.quiz,
  lessonQuizProgress: (state, { lessonQuizDone, lessonQuizCount }) =>
    (lessonQuizDone / lessonQuizCount) * 100,
  lessonIsDone: (state, { lessonQuizDone, lessonQuizCount }) =>
    lessonQuizDone === lessonQuizCount && lessonQuizCount !== 0,
  lessonQuizCount: state => state.lessonDetail.quiz.length,
  lessonQuizDone: state =>
    state.lessonDetail.quiz.filter(item => !!item.answer).length || 0,
  userSubscribeList: state => state.userSubscribeList,
  userSkillsList: state => state.userSkillsList,
  enterClassInfo: state => state.enterClassInfo,
  enterClassId: state => state.enterClassId
}
export default getters
