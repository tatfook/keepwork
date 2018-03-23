import _ from 'lodash'
import { newGitlabAPI } from '@/api'

const gitlabAPICache = {}
const getGitlabAPI = config => {
  let cacheKey = JSON.stringify(config)
  let getlabAPI = gitlabAPICache[cacheKey] || (
    gitlabAPICache[cacheKey] = newGitlabAPI(config)
  )
  console.log('getGitlabAPI: ', getlabAPI)
  return getlabAPI
}

/*doc
  getGitFileOptionsByPath
  we need {projectId, ref} to access file in gitlab server
  we use 'master' as default ref usually
*/
const getGitFileOptionsByPath = (rootGetters, path) => {
  let personalSitePathMap = rootGetters['user/personalSitePathMap']
  let defaultSiteProjectId = rootGetters['user/defaultSiteProjectId']
  let defaultSiteLastCommitId = rootGetters['user/defaultSiteLastCommitId']
  let [username, sitename] = path.split('/').filter(x => x)

  let projectId = _.get(personalSitePathMap, [`${username}/${sitename}`, 'projectId'], defaultSiteProjectId)
  let ref = _.get(personalSitePathMap, [`${username}/${sitename}`, 'lastCommitId'], defaultSiteLastCommitId) || 'master'
  let gitFileParams = {projectId, ref}

  return gitFileParams
}

const getters = {
  getGitlabAPI: (state, getters, rootState, rootGetters) => () => {
    let config = rootGetters['user/gitlabConfig']
    return getGitlabAPI(config)
  },
  getGitFileOptionsByPath: (state, getters, rootState, rootGetters) => path => {
    return getGitFileOptionsByPath(rootGetters, path)
  },

  repositoryTrees: state => state.repositoryTrees,
  files: state => state.files
}

export default getters
