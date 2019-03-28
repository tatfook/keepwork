import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import teacher from './teacher'
import student from './student'

const state = {
  orgsDetailForId: {},
  orgsDetailForLoginUrl: {},
  currentOrg: {},
  orgPackages: {},
  orgPackagesGraphql: {},
  orgPackagesDetail: {},
  orgLessonData: {},
  orgLessonDetail: {},
  orgClasses: {},
  orgTeachers: {},
  orgStudents: {}
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    teacher,
    student
  }
}
