import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  balance: {},
  trades: [],
  rechargeOrder: {},
  tradeOrder: {},
  discounts: []
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
