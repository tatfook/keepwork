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
  isQuizAllRight: (state, { lessonQuiz }) => (lessonQuiz.length > 0 ? _.every(lessonQuiz, o => o.result) : false),
  lessonQuizDone: (state, { lessonQuiz }) => _.filter(lessonQuiz, ({ answer }) => !!answer).length,
  isShowSummary: state => state.isShowSummary,
  enterClassInfo: state => state.enterClassInfo,
  teachingLesson: state => state.teachingLesson,
  enterClassId: (state, { classroom }) => classroom.key,
  learnRecordsId: state => state.learnRecordsId,
  userInfo: state => state.userInfo,
  howManyDays: (state, { userInfo }) => _.get(userInfo, 'extra.learn.learnDayCount', 0),
  learnRecords: (
    state,
    { lessonQuiz, howManyDays },
    rootState,
    { 'org/userinfo': { portrait, nickname, username } }
  ) => ({
    name: nickname || username,
    quiz: lessonQuiz,
    username,
    portrait,
    howManyDays
  })
}

export default getters
