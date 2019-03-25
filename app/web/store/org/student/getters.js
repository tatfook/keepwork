import _ from 'lodash'

const getters = {
  orgClasses: state => state.orgClasses,
  orgPackages: state => state.orgPackages,
  orgPackagesDetail: state => state.orgPackagesDetail,
  orgLessonData: state => state.lessonData,
  orgLessonDetail: state => state.orgLessonDetail,
  classroom: state => state.classroom,
  classroomKey: (state, { classroom }) => _.get(classroom, 'key', ''),
  isBeInClassroom: (state, { classroom }) => !_.isEmpty(classroom),
  isTeaching: (state, { classroom }) => _.get(classroom, 'state', '') === 1,
  isClassOver: (state, { classroom }) => _.get(classroom, 'state', '') === 2,
  classId: (state, { classroom }) => classroom.id,
  lessonQuiz: (state, { orgLessonDetail }) => _.get(orgLessonDetail, 'quiz', []),
  lessonQuizProgress: (state, { lessonQuizDone, lessonQuizCount }) => lessonQuizDone / lessonQuizCount * 100 || 0,
  lessonIsDone: (state, { lessonQuizDone, lessonQuizCount }) =>
    lessonQuizCount !== 0 && lessonQuizDone === lessonQuizCount,
  lessonQuizCount: (state, { lessonQuiz }) => lessonQuiz.length,
  isQuizAllRight: (state, { lessonQuiz }) => (lessonQuiz.length > 0 ? _.every(lessonQuiz, (o) => o.result) : false),
  lessonQuizDone: (state, { lessonQuiz }) => _.filter(lessonQuiz, ({ answer }) => !!answer).length,
  isShowSummary: (state) => state.isShowSummary,
  enterClassInfo: (state) => state.enterClassInfo,
  // classroomId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  // classId: (state, { enterClassInfo }) => enterClassInfo.id || '',
  enterClassId: (state, { classroom }) => classroom.key,
  learnRecordsId: (state) => state.learnRecordsId,
  learnRecords: (
    state,
    { lessonQuiz },
    rootState,
    { 'org/userinfo': { nickname, username }, 'user/profile': { portrait }, 'org/howManyDays': howManyDays }
  ) => ({
    name: nickname,
    quiz: lessonQuiz,
    username,
    portrait,
    howManyDays
  })
}

export default getters