import student from './student'
import teacher from './teacher'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  skills: [],
  subjects: [],
  userinfo: {},
  lessonsDetail: {},
  packagesList: {},
  packagesDetail: {},
  isShowLoginDialog: {},
  previewFlag: {},
  TagsPackages: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,

  modules: {
    student,
    teacher
  }
}
