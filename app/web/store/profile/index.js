import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = {
  userFavoriteState: [],
  favoriteUsers: [],
  followUsers: [],
  createdProjects: [],
  joinedProjects: []
}
export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
