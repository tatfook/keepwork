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
  siteDetailInfoById: {},
  webTemplateConfig: [],
  webPageTemplateConfig: [],
  siteLayoutConfigs: {},
  skyDrive: {},
  usersDetail: [],
  siteThemeConfigs: {},
  siteFiles: {},
  filesRawUrl: {},
  sendCodeInfo: {},
  authCodeInfo: {},
  threeServices: [],
  tokenUpdateAt: null,
  newSiteInfo: {}
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
