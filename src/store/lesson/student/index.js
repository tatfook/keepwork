import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  packagesDetail: {},
  lessonData: {},
  lessonDetail: {},
  lessonQuiz: {},
  isShowStudentSummary: false,
  userSubscribeList: [],
  userSkillsList: [],
  enterClassInfo: {},
  enterClassId: '',
  studentName: ''
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
