import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  packagesDetail: {},
  lessons: {},
  lessonSelfStudy: {},
  userSubscribeList: [],
  userSkillsList: [],
  enterClassInfo: [],
  enterClassId: Number
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
