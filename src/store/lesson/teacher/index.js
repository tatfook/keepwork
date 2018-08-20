import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  isShowLesson: false,
  isShowPerformance: true,
  isShowSummary: false,
  isShowHint: true,
  classroom: {},
  lessonDetail: {},
  lessonContent: {}
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
