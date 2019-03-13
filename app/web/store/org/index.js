import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  userinfo: {},
  orgsDetailForId: [],
  orgsDetailForName: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
