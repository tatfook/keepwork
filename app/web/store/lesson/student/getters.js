import _ from 'lodash'

const getters = {
  subscribesList: (state) => state.subscribesList,
  studentPackageDetail: (state) => ({ packageId }) => _.get(state.packagesDetail, packageId),
  lessonDetail: (state) => state.lessonDetail,
  lessonUserId: (state, { lessonDetail }) => _.get(lessonDetail, 'lesson.userId', ''),
  lessonQuiz: (state) => state.lessonDetail.quiz,
  lessonQuizProgress: (state, { lessonQuizDone, lessonQuizCount }) => lessonQuizDone / lessonQuizCount * 100 || 0,
  lessonIsDone: (state, { lessonQuizDone, lessonQuizCount }) =>
    lessonQuizCount !== 0 && lessonQuizDone === lessonQuizCount,
  lessonQuizCount: (state) => _.get(state, 'lessonDetail.quiz.length', 0),
  isQuizAllRight: (state, { lessonQuiz }) => (_.get(lessonQuiz, 'length', 0) > 0 ? _.every(lessonQuiz, (o) => o.result) : false),
  lessonQuizDone: (state) => _.filter(state.lessonDetail.quiz, ({ answer }) => !!answer).length,
  isShowSummary: (state) => state.isShowSummary,
  enterClassInfo: (state) => state.enterClassInfo,
  classroomId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  classId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  visitorInfo: (state) => state.visitorInfo,
  visitorClassId: (state, { visitorInfo }) => visitorInfo.learnRecordId || '',
  isBeInClassroom: (state, { classroomId }) => Boolean(classroomId),
  enterClassId: (state) => state.enterClassId,
  learnRecordsId: (state) => state.learnRecordsId,
  status: (state) => state.status,
  device: (state) => state.device,
  learnRecords: (
    state,
    { lessonQuiz, status, device },
    rootState,
    { 'lesson/userinfo': { nickname, username }, 'user/profile': { portrait }, 'lesson/howManyDays': howManyDays }
  ) => ({
    name: nickname,
    status: `${device}${status}`,
    quiz: lessonQuiz,
    username,
    portrait,
    howManyDays
  })
}
export default getters
