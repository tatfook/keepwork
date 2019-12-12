import _ from 'lodash'
import Cookies from 'js-cookie'
import {
  sortFolder2Top,
  gitTree2NestedArray,
  getFileFullPathByPath,
  getFileSitePathByPath,
  EMPTY_GIT_FOLDER_KEEPER_REGEX,
  CONFIG_FOLDER_NAME
} from '@/lib/utils/gitlab'
import LayoutHelper from '@/lib/mod/layout'
import ThemeHelper from '@/lib/theme'

const getters = {
  isShowLoginDialog: state => state.isShowLoginDialog,
  isShowRealName: state => state.isShowRealName,
  isShowAccountEncrypt: state => state.isShowAccountEncrypt,
  tokenUpdateAt: state => state.tokenUpdateAt, // to prevent the cache on token getting
  getToken: state => () => Cookies.get('token'),
  token: (state, { tokenUpdateAt, getToken }) => getToken(tokenUpdateAt),
  profile: (state, { getToken }) => {
    let token = getToken()
    let { token: profileUserToken } = state.profile
    if (!token || !profileUserToken || profileUserToken !== token) return {}
    let faker_vip = {
      _id: 999,
      endDate: '',
      isValid: false,
      startDate: '2018-05-03',
      username: 'faker',
      vipLevel: 0
    }
    return { ...state.profile, vipInfo: faker_vip }
  },
  isLogined: (state, { token }) => !!token,
  username: (state, { profile: { username } }) => username,
  displayUsername: (state, { profile: { username, displayUsername } }) => (displayUsername || username || ''),
  userId: (state, { profile: { id: userId } }) => userId,
  vipInfo: (state, { profile: { vipInfo } }) => vipInfo,
  realname: (state, { profile }) => _.get(profile, 'realname', {}),
  isRealNamed: (state, { realname }) => Boolean(realname),
  cellphone: (state, { profile }) => _.get(profile, 'cellphone', ''),
  defaultSiteDataSource: (state, { profile: { defaultSiteDataSource = {} } }) =>
    defaultSiteDataSource,
  gitlabConfig: (state, { token }) => ({
    url: process.env.KEEPWORK_API_PREFIX, // _.get(defaultSiteDataSource, 'rawBaseUrl'),
    token: `Bearer ${token}`
    // token: _.get(defaultSiteDataSource, 'dataSourceToken')
  }),
  sendCodeInfo: (state) => state.sendCodeInfo,
  authCodeInfo: (state) => state.authCodeInfo,

  siteDataSourcesMap: (state, { username }) => _.get(state, ['siteDataSource', username]),
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
      let files = _.get(repositoryTrees, [rootPath, rootPath], []).filter(
        ({ name }) => !EMPTY_GIT_FOLDER_KEEPER_REGEX.test(name)
      )
      let children = sortFolder2Top(files, rootPath).filter(
        ({ name }) => name !== CONFIG_FOLDER_NAME
      )
      let { extra, ...website } = websitesMap[name]
      return {
        projectId,
        lastCommitId,
        children,
        username,
        name,
        ...extra,
        ...website
      }
    })
    return personalSiteList
  },
  getDetailByUsername: (
    state
  ) => username => {
    let { usersDetail } = state
    return usersDetail[username]
  },
  getDetailByUserId: state => ({ userId }) => _.get(state.usersDetail, userId),
  getDetailWithRankByUserId: state => ({ userId }) => _.get(state.usersDetailWithRank, userId),
  getDetailWithRankByUsername: state => ({ username }) => _.get(state.usersDetailWithRank, username),
  personalSiteList: (state, { username, getPersonalSiteListByUsername }) => {
    let personalSiteList = getPersonalSiteListByUsername(username)
    return personalSiteList
  },
  personalSitePathMap: (state, { personalSiteList }) =>
    _.keyBy(personalSiteList, ({ username, name }) => `${username}/${name}`),
  personalAllPagePathList: (state, { personalSitePathMap }) => {
    let sitepaths = _.keys(personalSitePathMap)

    let getChildrenPathsDeep = x => {
      let result = []
      result.push(x.path)
      x.children && x.children.length && x.children.forEach(
        child => (result = result.concat(getChildrenPathsDeep(child)))
      )
      return result
    }

    let allPageList = sitepaths.reduce((prev, sitepath) => {
      return [
        ...prev,
        ...getChildrenPathsDeep({
          ...personalSitePathMap[sitepath],
          path: sitepath
        })
      ]
    }, [])
    allPageList = allPageList.map(str => {
      return str && str.replace(/\.[^.]+/, '')
    })

    return allPageList
  },
  getPersonalSiteInfoByPath: (state, { personalSitePathMap }) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return personalSitePathMap[`${username}/${name}`]
  },
  getUserSitePrivilege: state => ({ userId, siteId }) => {
    return _.get(state.userSitePrivilege, `${userId}.${siteId}`)
  },
  userGroups: state => state.userGroups,
  getSiteGroupsById: state => ({ siteId }) => _.get(state.sitesGroups, siteId, []),
  personalWebsiteNames: (state, { personalSiteList = [] }) => personalSiteList.map(site => site.name),

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
      // let {
      //   projectId,
      //   dataSource: { lastCommitId }
      // } = contributedWebsitesMapByRootpath[rootPath]
      let files = _.get(repositoryTrees, [rootPath, rootPath], []).filter(
        ({ name }) => !EMPTY_GIT_FOLDER_KEEPER_REGEX.test(name)
      )
      let children = gitTree2NestedArray(files, rootPath).filter(
        ({ name }) => name !== CONFIG_FOLDER_NAME
      )
      // FIXME: 手动增加memberName可能存在问题
      return {
        ...contributedWebsitesMapByRootpath[rootPath],
        memberName: username,
        // projectId,
        // lastCommitId,
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

  personalAndContributedSiteNameList: (state, { personalAndContributedSiteList }) => _.map(personalAndContributedSiteList, ({ name }) => name),
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
  siteDetailInfoById: state => state.siteDetailInfoById,
  getSiteDetailInfoById: (state, { siteDetailInfoById }) => ({ siteId }) => {
    return siteDetailInfoById[siteId]
  },
  getSiteDetailInfoDataSourceByPath: (
    state,
    { getSiteDetailInfoByPath }
  ) => path => {
    let [username, sitename] = path.split('/').filter(x => x)
    let {
      userinfo: { dataSource: dataSourceList = [], defaultDataSourceSitename = '__keepwork__' }
    } = getSiteDetailInfoByPath(path)
    let defaultDataSource = dataSourceList.filter(dataSource => dataSource.sitename === defaultDataSourceSitename)[0]
    let targetDataSource = dataSourceList.filter(
      dataSource => dataSource.username === username && dataSource.sitename === sitename
    )[0] || defaultDataSource
    return {
      ...targetDataSource,
      rawBaseUrl: process.env.KEEPWORK_API_PREFIX
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
    if (!path) return []
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

  webPageTemplateConfig: state => state.webPageTemplateConfig,
  getWebPageTemplates: (state, { webPageTemplateConfig = [] }) => categoryName => {
    let categoriesMap = _.keyBy(webPageTemplateConfig, 'name')
    return _.get(categoriesMap, [categoryName, 'templates'], [])
  },
  getWebPageTemplate: (state, { getWebPageTemplates }) => ({
    categoryName,
    templateName
  }) => {
    let templatesInCategory = getWebPageTemplates(categoryName)
    return _.get(_.keyBy(templatesInCategory, 'name'), [templateName], {})
  },

  activePageStarInfo: state => state.activePageStarInfo,
  siteThemeConfigs: state => state.siteThemeConfigs,
  siteThemeConfigBySitePath: (state, { siteThemeConfigs }) => sitePath => siteThemeConfigs[sitePath] || ThemeHelper.defaultTheme,
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
      ({ content }) => _.keys(content).filter(
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
  skyDriveInfo: (state, { skyDrive: { info = {} } }) => info,

  siteFileBySitePathAndFileId: (state) => ({ sitePath, fileId }) => _.get(state, ['siteFiles', sitePath, fileId]),
  rawUrlByFileId: (state) => ({ fileId }) => _.get(state.filesRawUrl, fileId),
  threeServices: (state) => state.threeServices,
  getThreeService: (state, { threeServices }) => type => {
    let result = _.find(threeServices, (o) => {
      return o.type === type
    })
    return result
  },
  newSiteInfo: state => state.newSiteInfo
}

export default getters
