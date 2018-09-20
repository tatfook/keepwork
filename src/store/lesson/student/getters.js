import _ from 'lodash'

const getters = {
  subscribesList: state => state.subscribesList,
  studentPackageDetail: state => ({ packageId }) =>
    _.get(state.packagesDetail, packageId),
  lessonDetail: state => state.lessonDetail,
  lessonUserId: (state, { lessonDetail }) =>
    _.get(lessonDetail, 'lesson.userId', ''),
  lessonQuiz: state => state.lessonDetail.quiz,
  lessonQuizProgress: (state, { lessonQuizDone, lessonQuizCount }) =>
    (lessonQuizDone / lessonQuizCount) * 100 || 0,
  lessonIsDone: (state, { lessonQuizDone, lessonQuizCount }) =>
    lessonQuizCount !== 0 && lessonQuizDone === lessonQuizCount,
  lessonQuizCount: state => _.get(state, 'lessonDetail.quiz.length', 0),
  isQuizAllRight: (state, { lessonQuiz }) => _.every(lessonQuiz, o => o.result),
  lessonQuizDone: state =>
    _.filter(state.lessonDetail.quiz, ({ answer }) => !!answer).length,
  isShowSummary: state => state.isShowSummary,
  enterClassInfo: state => state.enterClassInfo,
  classroomId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  classId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  isBeInClassroom: (state, { classroomId }) => !!classroomId,
  enterClassId: state => state.enterClassId,
  learnRecordsId: state => state.learnRecordsId,
  learnRecords: (
    state,
    { lessonQuiz },
    rootState,
    {
      'lesson/userinfo': { nickname, username },
      'user/profile': { portrait },
      'lesson/howManyDays': howManyDays
    }
  ) => ({
    name: nickname,
    username: username,
    portrait: portrait,
    quiz: lessonQuiz,
    howManyDays: howManyDays
  })
}
export default getters
