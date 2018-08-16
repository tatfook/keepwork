import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  isShowLesson: true,
  isShowSummary: false,
  isShowPerformance: false,
  isShowHint: true,
  classId: null,
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
