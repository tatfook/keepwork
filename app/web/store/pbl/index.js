import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  isShowLoginDialog: false,
  allProjects: [],
  projects: [],
  projectApplyList: [],
  usersProjects: [],
  memberList: [],
  projectsFavoriteState: [],
  projectsStarState: [],
  commentList: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
