import _ from 'lodash'
import { GitAPI } from '@/api'
import {
  getFileFullPathByPath,
  EMPTY_GIT_FOLDER_KEEPER
} from '@/lib/utils/gitlab'

const gitlabAPICache = {}
const getGitlabAPI = config => {
  let cacheKey = JSON.stringify(config)
  let gitlabAPI =
    gitlabAPICache[cacheKey] ||
    (gitlabAPICache[cacheKey] = new GitAPI(config))
  return gitlabAPI
}

/*doc
  getGitFileOptionsByPath
  we need {projectId, ref} to access file in gitlab server
  we use 'master' as default ref usually
*/
const getGitFileOptionsByPath = (rootGetters, path) => {
  let personalAndContributedSitePathMap =
    rootGetters['user/personalAndContributedSitePathMap']
  let [username, sitename] = path.split('/').filter(x => x)

  let { projectId, lastCommitId: ref = 'master' } = _.get(
    personalAndContributedSitePathMap,
    `${username}/${sitename}`
  )
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
  // todo, read file form cache, clear cache while save
  let fullPath = getFileFullPathByPath(path)
  let file = rootGetters['gitlab/files'][fullPath]
  return file
}

const getters = {
  repositoryTrees: state => state.repositoryTrees,
  repositoryTreesAllFiles: (state, { repositoryTrees = [] }) => {
    let projects = _.values(repositoryTrees)
    let allFiles = projects.reduce((prev, sitesMap) => {
      let sites = _.values(sitesMap)
      let filesInSites = sites.reduce((prev, files) => {
        return prev.concat(files)
      }, [])
      return prev.concat(filesInSites)
    }, [])
    return allFiles
  },
  childNamesByPath: (
    state,
    { repositoryTreesAllFiles: files = [] }
  ) => path => {
    let repositoryTreesAllFilePaths = files.map(file => file.path)
    let names = repositoryTreesAllFilePaths
      .filter(filePath => filePath.indexOf(path) === 0 && filePath !== path)
      .map(filePath => filePath.replace(path + '/', '').split('/')[0])
      .filter(name => name && name !== EMPTY_GIT_FOLDER_KEEPER)
      .map(name => name.replace(/\.md$/, ''))
    return _.uniq(names)
  },
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
