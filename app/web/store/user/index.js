import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  profile: {},
  website: {},
  contributedWebsite: {},
  siteDataSource: {},
  comments: {},
  siteDetailInfo: {},
  webTemplateConfig: [],
  webPageTemplateConfig: [],
  siteLayoutConfigs: {},
  skyDrive: {},
  usersDetail: [],
  siteThemeConfigs: {},
  siteFiles: {},
  sendCodeInfo: {},
  authCodeInfo: {},
  threeServices: [],
  tokenUpdateAt: null
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
