import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  subscribesList: [],
  packagesDetail: {},
  lessonDetail: {},
  lessonQuiz: {},
  isShowStudentSummary: false,
  enterClassInfo: {},
  enterClassId: '',
  learnRecordsId: ''
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
