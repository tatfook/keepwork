import _ from 'lodash'

const getters = {
  classReportStatistics: state => state.classReportStatistics,
  evaluationCommentList: state => state.evaluationCommentList,
  evaluationReportCommentDetail: state => state.evaluationReportCommentDetail,
  orgClasses: state => state.orgClasses,
  orgPackages: state => state.orgPackages,
  orgPackageStatus: (state, { orgPackages }) => packageId => {
    return _.find(
      orgPackages,
      item => item.package.id === _.toNumber(packageId)
    )
  },
  orgPackagesDetail: state => state.orgPackagesDetail,
  orgLessonData: state => state.lessonData,
  orgLessonDetail: state => state.orgLessonDetail,
  classroom: state => state.classroom,
  classroomKey: (state, { classroom }) => _.get(classroom, 'key', ''),
  isBeInClassroom: (state, { classroom }) => !_.isEmpty(classroom),
  isTeaching: (state, { classroom }) => _.get(classroom, 'state', '') === 1,
  isClassOver: (state, { classroom }) => _.get(classroom, 'state', '') === 2,
  classId: (state, { classroom }) => classroom.id,
  lessonQuiz: (state, { orgLessonDetail }) =>
    _.get(orgLessonDetail, 'quiz', []),
  lessonQuizProgress: (state, { lessonQuizDone, lessonQuizCount }) =>
    (lessonQuizDone / lessonQuizCount) * 100 || 0,
  lessonIsDone: (state, { lessonQuizDone, lessonQuizCount }) =>
    lessonQuizCount !== 0 && lessonQuizDone === lessonQuizCount,
  lessonQuizCount: (state, { lessonQuiz }) => lessonQuiz.length,
  isQuizAllRight: (state, { lessonQuiz }) =>
    (lessonQuiz.length > 0 ? _.every(lessonQuiz, o => o.result) : false),
  lessonQuizDone: (state, { lessonQuiz }) =>
    _.filter(lessonQuiz, ({ answer }) => !!answer).length,
  isShowSummary: state => state.isShowSummary,
  enterClassInfo: state => state.enterClassInfo,
  enterClassId: (state, { classroom }) => classroom.key,
  learnRecordsId: state => state.learnRecordsId,
  userInfo: state => state.userInfo,
  howManyDays: (state, { userInfo }) =>
    _.get(userInfo, 'extra.learn.learnDayCount', 0),
  learnRecords: (
    state,
    { lessonQuiz, howManyDays, orgRealName },
    rootState,
    { 'org/userinfo': { portrait, username } }
  ) => ({
    name: orgRealName,
    quiz: lessonQuiz,
    username,
    portrait,
    howManyDays
  }),
  myClassmate: state => state.myClassmate,
  myTeacher: state => state.myTeacher,
  classPackages: state => state.classPackages,
  lastUpdateProjects: state => state.lastUpdateProjects,
  moreLastUpdateProjects: state => state.moreLastUpdateProjects,
  getEvaluationCommentListByClassId: state => ({ classId }) =>
    _.get(state.evaluationCommentList, classId, []),
  userinfo: state => state.userinfo
}

export default getters
