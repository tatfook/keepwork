import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  packagesDetail: {},
  lessonData: {},
  lessonDetail: {},
  lessonQuiz: {},
  isShowStudentSummary: true,
  userSubscribeList: [],
  userSkillsList: [],
  enterClassInfo: {},
  enterClassId: null
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
