import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  isShowLesson: true,
  isShowSummary: false,
  isShowStudentStatus: false
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
