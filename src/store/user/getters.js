import _ from 'lodash'
import Cookies from 'js-cookie'
import {
  gitTree2NestedArray,
  getFileFullPathByPath,
  EMPTY_GIT_FOLDER_KEEPER
} from '@/lib/utils/gitlab'

const getters = {
  info: state => state.info,
  token: state => _.get(state, ['info', 'token'], Cookies.get('token')),
  profile: (state, {token}) => {
    let { token: profileUserToken } = state.profile
    if (profileUserToken !== token) return {}
    return state.profile
  },
  isLogined: (state, {profile}) => !_.isEmpty(_.omit(profile, ['token'])),
  username: (state, { profile: { username } }) => username,
  userId: (state, { profile: { _id: userId } }) => userId,
  vipInfo: (state, { profile: { vipInfo } }) => vipInfo,
  authRequestConfig: (state, { token }) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : {},

  defaultSiteDataSource: (state, { profile: { defaultSiteDataSource } }) => defaultSiteDataSource,
  gitlabConfig: (state, { defaultSiteDataSource }) => ({
    url: _.get(defaultSiteDataSource, 'rawBaseUrl'),
    token: _.get(defaultSiteDataSource, 'dataSourceToken')
  }),

  getPersonalSiteListByUsername: (state, getters, rootState, rootGetters) => username => {
    let { 'gitlab/repositoryTrees': repositoryTrees } = rootGetters
    let websitesMap = _.get(state, ['website', username])
    let siteDataSourcesMap = _.get(state, ['siteDataSource', username])

    // use websitesMap to generate personal website list
    let websiteNames = _.keys(websitesMap)

    let personalSiteList = websiteNames.map(name => {
      // use siteDataSourcesMap to get projectId and lastCommitId
      let projectId = _.get(siteDataSourcesMap, [name, 'projectId'])
      let lastCommitId = _.get(siteDataSourcesMap, [name, 'lastCommitId'])

      // use repositoryTrees to get the nested files list in certain personal site
      let rootPath = `${username}/${name}`
      let files = _.get(repositoryTrees, [projectId, rootPath], []).filter(
        ({ name }) => name !== EMPTY_GIT_FOLDER_KEEPER
      )
      let children = gitTree2NestedArray(files, rootPath)

      return {
        ...websitesMap[name],
        projectId,
        lastCommitId,
        children
      }
    })

    return personalSiteList
  },
  personalSiteList: (state, {username, getPersonalSiteListByUsername}) => {
    let personalSiteList = getPersonalSiteListByUsername(username)
    return personalSiteList
  },
  personalSitePathMap: (state, {personalSiteList}) => _.keyBy(personalSiteList, ({username, name}) => `${username}/${name}`),
  getPersonalSiteInfoByPath: (state, {personalSitePathMap}) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return personalSitePathMap[`${username}/${name}`]
  },

  getContributedSiteListByUsername: (state, getters, rootState, rootGetters) => username => {
    let { 'gitlab/repositoryTrees': repositoryTrees } = rootGetters
    let contributedWebsitesMapByRootpath = _.get(state, ['contributedWebsite', username])
    let websiteRootpaths = _.keys(contributedWebsitesMapByRootpath)

    let contributedSiteList = websiteRootpaths.map(rootPath => {
      let { projectId, dataSource: { lastCommitId } } = contributedWebsitesMapByRootpath[rootPath]
      let files = _.get(repositoryTrees, [projectId, rootPath], []).filter(
        ({ name }) => name !== EMPTY_GIT_FOLDER_KEEPER
      )
      let children = gitTree2NestedArray(files, rootPath)
      return {
        ...contributedWebsitesMapByRootpath[rootPath],
        projectId,
        lastCommitId,
        children
      }
    })

    return contributedSiteList
  },
  contributedSiteList: (state, {username, getContributedSiteListByUsername}) => getContributedSiteListByUsername(username),
  contributedSitePathMap: (state, {contributedSiteList}) => _.keyBy(contributedSiteList, ({username, name}) => `${username}/${name}`),

  personalAndContributedSiteList: (state, {personalSiteList, contributedSiteList}) => ([...personalSiteList, ...contributedSiteList]),
  personalAndContributedSitePathMap: (state, {personalSitePathMap, contributedSitePathMap}) => ({...personalSitePathMap, ...contributedSitePathMap}),
  // todo getContributedSiteListByUsername

  siteDetailInfo: state => state.siteDetailInfo,
  getSiteDetailInfoByPath: (state, {siteDetailInfo}) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return siteDetailInfo[`${username}/${name}`]
  },
  getSiteDetailInfoDataSourceByPath: (state, {getSiteDetailInfoByPath}) => path => {
    let [username, sitename] = path.split('/').filter(x => x)
    let {userinfo: {dataSource: dataSourceList = []}} = getSiteDetailInfoByPath(path)
    let targetDataSource = dataSourceList.filter(dataSource => {
      return dataSource.username === username && dataSource.sitename === sitename
    })[0]
    return targetDataSource
  },

  comments: state => state.comments,
  getCommentListByPath: (state, {comments}, rootState, rootGetters) => path => {
    let fullPath = getFileFullPathByPath(path)
    return comments[fullPath]
  },
  activePageCommentList: (state, {getCommentListByPath}, rootState, rootGetters) => {
    let activePagePath = rootGetters['activePage']
    return getCommentListByPath(activePagePath)
  },

  webTemplateConfig: state => state.webTemplateConfig,
  getWebTemplates: (state, { webTemplateConfig = [] }) => classify => {
    let categoriesMap = _.keyBy(webTemplateConfig, 'classify')
    return _.get(categoriesMap, [classify, 'templates'], [])
  },
  getWebTemplate: (state, { getWebTemplates }) => ({classify, templateName}) => {
    let templatesInClassify = getWebTemplates(classify)
    return _.get(_.keyBy(templatesInClassify, 'name'), [templateName], {})
  },
  getWebTemplateStyle: (state, { getWebTemplate }) => ({classify, templateName, styleName}) => {
    let { styles = [] } = getWebTemplate({classify, templateName})
    return styles[0] // _.keyBy(styles, 'name')[styleName]
  }
}

export default getters
