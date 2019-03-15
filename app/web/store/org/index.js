import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import teacher from './teacher'

const state = {
  userinfo: {},
  orgsDetailForId: {},
  orgsDetailForLoginUrl: {},
  currentOrg: {},
  orgPackages: {}
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    teacher
  }
}
