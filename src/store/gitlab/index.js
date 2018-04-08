import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  repositoryTrees: {},
  files: {},
  unsavedFiles: {}
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
