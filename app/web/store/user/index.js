import getters from './getters'
import actions from './actions'
import mutations from './mutations'

const state = () => ({
  isShowLoginDialog: false,
  isShowRealName: false,
  profile: {},
  website: {},
  userSitePrivilege: {},
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
  usersDetailWithRank: [],
  siteThemeConfigs: {},
  siteFiles: {},
  sitesGroups: {},
  userGroups: [],
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
