import _ from 'lodash'
import cookie from 'cookie'
import { gitTree2NestedArray } from '@/lib/utils'
import { EMPTY_GIT_FOLDER_KEEPER } from '@/lib/utils/consts'

const getters = {
  info: state => state.info,
  token: state => _.get(state, ['info', 'token'], _.get(cookie.parse(document.cookie), 'token')),
  username: state => _.get(state, 'profile.username'),
  authRequestConfig: (state, {token}) => token ? {headers: {'Authorization': `Bearer ${token}`}} : {},

  defaultSiteDataSource: state => _.get(state, 'profile.defaultSiteDataSource'),
  defaultSiteProjectId: (state, {defaultSiteDataSource}) => _.get(defaultSiteDataSource, 'projectId'),
  defaultSiteLastCommitId: (state, {defaultSiteDataSource}) => _.get(defaultSiteDataSource, 'lastCommitId'),

  gitlabConfig: (state, {defaultSiteDataSource}) => ({
    url: _.get(defaultSiteDataSource, 'rawBaseUrl'),
    token: _.get(defaultSiteDataSource, 'dataSourceToken')
  }),

  websitesMap: (state, {username}) => _.get(state, ['website', username]),
  siteDataSourcesMap: (state, {username}) => _.get(state, ['siteDataSource', username]),

  personalSiteList: (state, getters, rootState, rootGetters) => {
    let { username, websitesMap, siteDataSourcesMap, defaultSiteProjectId, defaultSiteLastCommitId } = getters
    let { 'gitlab/repositoryTrees': repositoryTrees } = rootGetters

    // use websitesMap to generate personal website list
    let websiteNames = _.keys(websitesMap)

    let personalSiteList = websiteNames.map(name => {
      // use siteDataSourcesMap to get projectId and lastCommitId
      let projectId = _.get(siteDataSourcesMap, [name, 'projectId'], defaultSiteProjectId)
      let lastCommitId = _.get(siteDataSourcesMap, [name, 'lastCommitId'], defaultSiteLastCommitId)

      // use repositoryTrees to get the nested files list in certain personal site
      let rootPath = `${username}/${name}`
      let files = _.get(repositoryTrees, [projectId, rootPath], []).filter(({name}) => name !== EMPTY_GIT_FOLDER_KEEPER)
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
  personalSitePathMap: (state, {personalSiteList}) => _.keyBy(personalSiteList, ({username, name}) => `${username}/${name}`),
  getPersonalSiteInfoByPath: (state, {personalSitePathMap}) => path => {
    let [username, name] = path.split('/').filter(x => x)
    return personalSitePathMap[`${username}/${name}`]
  },

  comments: state => state.comments,
  getCommentListByPath: (state, {comments}, rootState, rootGetters) => path => {
    let fullPath = rootGetters['gitlab/getFileFullPathByPath'](path)
    return comments[fullPath]
  },
  activePageCommentList: (state, {getCommentListByPath}, rootState, rootGetters) => {
    let activePagePath = rootGetters['activePage']
    return getCommentListByPath(activePagePath)
  }
}

export default getters
