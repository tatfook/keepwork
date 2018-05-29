import _ from 'lodash'
import Cookies from 'js-cookie'
import {
  gitTree2NestedArray,
  getFileFullPathByPath,
  getFileSitePathByPath,
  EMPTY_GIT_FOLDER_KEEPER,
  CONFIG_FOLDER_NAME
} from '@/lib/utils/gitlab'
import LayoutHelper from '@/lib/mod/layout'

const getters = {
  info: state => state.info,
  token: state => _.get(state, ['info', 'token'], Cookies.get('token')),
  profile: (state, { token }) => {
    let { token: profileUserToken } = state.profile
    if (profileUserToken !== token) return {}
    return state.profile
  },
  isLogined: (state, { profile }) => !_.isEmpty(_.omit(profile, ['token'])),
  username: (state, { profile: { username } }) => username,
  displayUsername: (state, { profile: { username, displayUsername } }) => (displayUsername || username || ''),
  userId: (state, { profile: { _id: userId } }) => userId,
  vipInfo: (state, { profile: { vipInfo } }) => vipInfo,
  authRequestConfig: (state, { token }) =>
    token ? { headers: { Authorization: `Bearer ${token}` } } : {},

  defaultSiteDataSource: (state, { profile: { defaultSiteDataSource } }) =>
    defaultSiteDataSource,
  gitlabConfig: (state, { defaultSiteDataSource }) => ({
    url: process.env.GITLAB_API_PREFIX, // _.get(defaultSiteDataSource, 'rawBaseUrl'),
    token: _.get(defaultSiteDataSource, 'dataSourceToken')
  }),

  siteDataSourcesMap: (state, {username}) => _.get(state, ['siteDataSource', username]),
  getPersonalSiteListByUsername: (
    state,
    { siteDataSourcesMap, defaultSiteDataSource },
    rootState,
    rootGetters
  ) => username => {
    let { 'gitlab/repositoryTrees': repositoryTrees } = rootGetters
    let websitesMap = _.get(state, ['website', username])
    let { projectId: defaultProjectId, lastCommitId: defaultLastCommitId } = defaultSiteDataSource

    // use websitesMap to generate personal website list
    let websiteNames = _.keys(websitesMap)

    let personalSiteList = websiteNames.map(name => {
      // use siteDataSourcesMap to get projectId and lastCommitId
      let projectId = _.get(siteDataSourcesMap, [name, 'projectId'], defaultProjectId)
      let lastCommitId = _.get(siteDataSourcesMap, [name, 'lastCommitId'], defaultLastCommitId)

      // use repositoryTrees to get the nested files list in certain personal site
      let rootPath = `${username}/${name}`
      let files = _.get(repositoryTrees, [projectId, rootPath], []).filter(
        ({ name }) => name !== EMPTY_GIT_FOLDER_KEEPER
      )
      let children = gitTree2NestedArray(files, rootPath).filter(
        ({ name }) => name !== CONFIG_FOLDER_NAME
      )

      return {
        ...websitesMap[name],
        projectId,
        lastCommitId,
        children
      }
    })

    return personalSiteList
  },
  personalSiteList: (state, { username, getPersonalSiteListByUsername }) => {
    let personalSiteList = getPersonalSiteListByUsername(username)
    return personalSiteList
  },
  personalSitePathMap: (state, { personalSiteList }) =>
    _.keyBy(personalSiteList, ({ username, name }) => `${username}/${name}`),
  getPersonalSiteInfoByPath: (state, { personalSitePathMap }) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return personalSitePathMap[`${username}/${name}`]
  },
  personalWebsiteNames: (state, {personalSiteList = []}) => personalSiteList.map(site => site.name),

  getContributedSiteListByUsername: (
    state,
    getters,
    rootState,
    rootGetters
  ) => username => {
    let { 'gitlab/repositoryTrees': repositoryTrees } = rootGetters
    let contributedWebsitesMapByRootpath = _.get(state, [
      'contributedWebsite',
      username
    ])
    let websiteRootpaths = _.keys(contributedWebsitesMapByRootpath)

    let contributedSiteList = websiteRootpaths.map(rootPath => {
      let {
        projectId,
        dataSource: { lastCommitId }
      } = contributedWebsitesMapByRootpath[rootPath]
      let files = _.get(repositoryTrees, [projectId, rootPath], []).filter(
        ({ name }) => name !== EMPTY_GIT_FOLDER_KEEPER
      )
      let children = gitTree2NestedArray(files, rootPath).filter(
        ({ name }) => name !== CONFIG_FOLDER_NAME
      )
      return {
        ...contributedWebsitesMapByRootpath[rootPath],
        projectId,
        lastCommitId,
        children
      }
    })

    return contributedSiteList
  },
  contributedSiteList: (
    state,
    { username, getContributedSiteListByUsername }
  ) => getContributedSiteListByUsername(username),
  contributedSitePathMap: (state, { contributedSiteList }) =>
    _.keyBy(contributedSiteList, ({ username, name }) => `${username}/${name}`),

  personalAndContributedSiteList: (
    state,
    { personalSiteList, contributedSiteList }
  ) => [...personalSiteList, ...contributedSiteList],
  personalAndContributedSitePathMap: (
    state,
    { personalSitePathMap, contributedSitePathMap }
  ) => ({ ...personalSitePathMap, ...contributedSitePathMap }),
  // todo getContributedSiteListByUsername

  siteDetailInfo: state => state.siteDetailInfo,
  getSiteDetailInfoByPath: (state, { siteDetailInfo }) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return siteDetailInfo[`${username}/${name}`]
  },
  getSiteDetailInfoDataSourceByPath: (
    state,
    { getSiteDetailInfoByPath }
  ) => path => {
    let [username, sitename] = path.split('/').filter(x => x)
    let {
      userinfo: { dataSource: dataSourceList = [], defaultDataSourceSitename }
    } = getSiteDetailInfoByPath(path)
    let defaultDataSource = dataSourceList.filter(dataSource => dataSource.sitename === defaultDataSourceSitename)[0]
    let targetDataSource = dataSourceList.filter(
      dataSource => dataSource.username === username && dataSource.sitename === sitename
    )[0] || defaultDataSource
    return {
      ...targetDataSource,
      rawBaseUrl: process.env.GITLAB_API_PREFIX
    }
  },

  getGitFileProjectIdAndRefByPath: (state, { personalAndContributedSitePathMap, defaultSiteDataSource }) => path => {
    let [username, sitename] = path.split('/').filter(x => x)
    let { projectId, lastCommitId: ref = 'master' } = _.get(
      personalAndContributedSitePathMap,
      `${username}/${sitename}`,
      defaultSiteDataSource
    )
    return { projectId, ref }
  },

  comments: state => state.comments,
  getCommentListByPath: (
    state,
    { comments },
    rootState,
    rootGetters
  ) => path => {
    let fullPath = getFileFullPathByPath(path)
    return comments[fullPath]
  },
  activePageCommentList: (
    state,
    { getCommentListByPath },
    rootState,
    rootGetters
  ) => {
    let activePagePath = rootGetters['activePageUrl']
    return getCommentListByPath(activePagePath)
  },

  webTemplateConfig: state => state.webTemplateConfig,
  getWebTemplates: (state, { webTemplateConfig = [] }) => categoryName => {
    let categoriesMap = _.keyBy(webTemplateConfig, 'name')
    return _.get(categoriesMap, [categoryName, 'templates'], [])
  },
  getWebTemplate: (state, { getWebTemplates }) => ({
    categoryName,
    templateName
  }) => {
    let templatesInCategory = getWebTemplates(categoryName)
    return _.get(_.keyBy(templatesInCategory, 'name'), [templateName], {})
  },

  activePageStarInfo: state => state.activePageStarInfo,

  siteLayoutConfigs: state => state.siteLayoutConfigs,
  siteLayoutConfigBySitePath: (state, { siteLayoutConfigs }) => sitePath => siteLayoutConfigs[sitePath] || {},
  siteLayoutsBySitePath: (state, { siteLayoutConfigBySitePath }) => sitePath => {
    let siteLayoutConfig = siteLayoutConfigBySitePath(sitePath)
    let allLayouts = _.get(siteLayoutConfig, ['layoutConfig', 'layouts'], [])
    return allLayouts
  },
  allLayoutContentFilePathsBySitePath: (state, { siteLayoutsBySitePath }) => sitePath => {
    let allLayouts = siteLayoutsBySitePath(sitePath)
    let allLayoutContentFilePaths = _.flatten(allLayouts.map(
      ({content}) => _.keys(content).filter(
        key => (content[key] || '').trim()
      ).map(
        key => `${key}s/${content[key]}`
      )
    ))
    return allLayoutContentFilePaths
  },
  getLayoutByPath: (state, { siteLayoutConfigBySitePath }) => path => {
    let sitePath = getFileSitePathByPath(path)
    let siteLayoutConfig = siteLayoutConfigBySitePath(sitePath)
    let layout = LayoutHelper.getLayoutByPath(siteLayoutConfig, path)
    return layout
  },
  layoutContentFilePathsByPath: (state, { getLayoutByPath }) => path => {
    let layout = getLayoutByPath(path)
    let layoutContentFilePaths = _.keys(layout.content).filter(key => layout.content[key]).map(key => `${key}s/${layout.content[key]}`)
    return layoutContentFilePaths
  },
  getSettedPageLayoutByPath: (state, { siteLayoutConfigBySitePath }) => path => {
    let sitePath = getFileSitePathByPath(path)
    let siteLayoutConfig = siteLayoutConfigBySitePath(sitePath)
    let layout = LayoutHelper.getSettedPageLayoutByPath(siteLayoutConfig, path)
    return layout
  },

  skyDrive: (state, { username }) => _.get(state.skyDrive, username, {}),
  skyDriveFileList: (state, { skyDrive: { filelist = [] } }) => filelist,
  skyDriveInfo: (state, { skyDrive: { info = {} } }) => info
}

export default getters
