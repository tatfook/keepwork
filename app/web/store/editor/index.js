import state from './state'
import getters from './getters'
import actions from './actions'
import mutations from './mutations'

export default {
  namespaced: false, // todo: change it to true to reduce global name risk
  state,
  getters,
  actions,
  mutations
}
