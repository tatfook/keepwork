import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  orgClasses: [],
  orgClassPackages: {},
  orgClassStudents: {},
  orgClassPackagesDetail: {}
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}