import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  projects: {},
  repositoryTrees: {},
  files: {}
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
