import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import teacher from './teacher'
import student from './student'

const state = {
  tokenUpdateAt: null,
  orgsDetailForId: {},
  orgsDetailForLoginUrl: {},
  currentOrg: {},
  orgPackages: {},
  orgPackagesWithLesson: {},
  orgPackagesDetail: {},
  orgLessonData: {},
  orgLessonDetail: {},
  orgClasses: {},
  orgClassesWithMember: {},
  orgTeachers: {},
  orgStudents: {},
  userOrg: [],
  orgActiveCodeList: {},
  printCodeList: {},
  orgHistoricalClasses: {},
  expirationDialogVisible: false,
  orgForms: {},
  formsFeedback: {},
  orgLogs: {},
  classEvaluations: {},
  classEvaluationList: {},
  orgClassesReport: {},
  sendedMessages: [],
  codeUsedStatus: {},
  useFormalCodeParams: {},
  reActivatedParams: {},
  historyStudents: {},
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    teacher,
    student,
  },
}
