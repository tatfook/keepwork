import _ from 'lodash'
import { newGitlabAPI } from '@/api'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'

const gitlabAPICache = {}
const getGitlabAPI = config => {
  let cacheKey = JSON.stringify(config)
  let getlabAPI =
    gitlabAPICache[cacheKey] ||
    (gitlabAPICache[cacheKey] = newGitlabAPI(config))
  return getlabAPI
}

/*doc
  getGitFileOptionsByPath
  we need {projectId, ref} to access file in gitlab server
  we use 'master' as default ref usually
*/
const getGitFileOptionsByPath = (rootGetters, path) => {
  let personalSitePathMap = rootGetters['user/personalSitePathMap']
  let [username, sitename] = path.split('/').filter(x => x)

  let {projectId, ref = 'master'} = _.get(personalSitePathMap, `${username}/${sitename}`)
  let gitFileParams = { projectId, ref }

  return gitFileParams
}

const getProjectIdByPath = (rootGetters, path) => {
  let [username, name] = path.split('/').filter(x => x)
  let personalSitePathMap = rootGetters['user/personalSitePathMap']
  let projectId = _.get(personalSitePathMap, [
    `${username}/${name}`,
    'projectId'
  ])
  return projectId
}

const getFileByPath = (rootGetters, path) => {
  let fullPath = getFileFullPathByPath(path)
  let content = rootGetters['gitlab/files'][fullPath]
  return content
}

const getters = {
  repositoryTrees: state => state.repositoryTrees,
  files: state => state.files,

  getGitlabAPI: (state, getters, rootState, rootGetters) => () => {
    let config = rootGetters['user/gitlabConfig']
    return getGitlabAPI(config)
  },
  getGitFileOptionsByPath: (state, getters, rootState, rootGetters) => path => {
    return getGitFileOptionsByPath(rootGetters, path)
  },

  getProjectIdByPath: (state, getters, rootState, rootGetters) => path => {
    return getProjectIdByPath(rootGetters, path)
  },
  getFileByPath: (state, getters, rootState, rootGetters) => path => {
    return getFileByPath(rootGetters, path)
  }
}

export default getters
