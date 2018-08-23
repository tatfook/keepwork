import center from './center'
import student from './student'
import teacher from './teacher'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  allSubjects: [],
  userinfo: {},
  packagesDetail: {}
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,

  modules: {
    center,
    student,
    teacher
  }
}
