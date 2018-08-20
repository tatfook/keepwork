import _ from 'lodash'

const getters = {
  studentPackageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  lessonDetail: state => state.lessonDetail,
  lessonQuiz: state => state.lessonDetail.quiz,
  lessonQuizProgress: (state, { lessonQuizDone, lessonQuizCount }) =>
    (lessonQuizDone / lessonQuizCount) * 100 || 0,
  lessonIsDone: (state, { lessonQuizDone, lessonQuizCount }) =>
    lessonQuizCount !== 0 && lessonQuizDone === lessonQuizCount,
  lessonQuizCount: state => _.get(state, 'lessonDetail.quiz.length', 0),
  lessonQuizDone: state =>
    _.filter(state.lessonDetail.quiz, ({ answer }) => !!answer).length,
  isShowSummary: state => state.isShowSummary,
  userSubscribeList: state => state.userSubscribeList,
  userSkillsList: state => state.userSkillsList,
  enterClassInfo: state => state.enterClassInfo,
  classroomId: (state, { enterClassInfo }) => enterClassInfo.classroomId || '',
  isBeInClassroom: (state, { classroomId }) => !!classroomId,
  enterClassId: state => state.enterClassId
}
export default getters
