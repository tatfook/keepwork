import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  isShowLoginDialog: false,
  projects: [],
  projectApplyList: [],
  usersProjects: [],
  memberList: [],
  projectsFavoriteState: [],
  projectsStarState: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
