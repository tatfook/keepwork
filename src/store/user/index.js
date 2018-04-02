import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  info: {},
  profile: {},
  website: {},
  siteDataSource: {},
  comments: {},
  siteDetailInfo: {}
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
