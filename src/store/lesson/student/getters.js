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
  enterClassInfo: state => state.enterClassInfo,
  classroomId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  classId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  isBeInClassroom: (state, { classroomId }) => !!classroomId,
  enterClassId: state => state.enterClassId,
  learnRecords: (
    state,
    { lessonQuiz },
    rootState,
    { 'lesson/userinfo': { nickname, username }, 'user/profile': { portrait } }
  ) => ({
    name: nickname,
    username: username,
    portrait: portrait,
    quiz: lessonQuiz
  })
}
export default getters
