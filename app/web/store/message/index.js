import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  messages: {},
  unreadMessagesCount: 0,
  messagesBox: {},
  unreadList: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}