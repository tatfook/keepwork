import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  isShowLessonHint: true,
  orgClasses: [],
  orgStudents: {},
  orgClassPackages: {},
  orgClassStudents: {},
  orgClassTeachers: {},
  orgClassEvaluationReports: {},
  orgClassEvaluationReportCount: {},
  evaluationReportDetail: {},
  evaluationReportCommentDetail: {},
  lastUpdateProjects: [],
  moreLastUpdateProjects: [],
  classroomCoursesData: {},
  orgClassPackagesDetail: {},
  orgLessonData: {},
  orgLessonDetail: {},
  classroom: {},
  learnRecords: [],
  lessonContent: {},
  classroomLearnRecord: [],
  classroomQuiz: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}