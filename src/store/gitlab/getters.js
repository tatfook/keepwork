import _ from 'lodash'
import { newGitlabAPI } from '@/api'
import { suffixFileExtension } from '@/lib/utils'

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
  let defaultSiteProjectId = rootGetters['user/defaultSiteProjectId']
  let defaultSiteLastCommitId = rootGetters['user/defaultSiteLastCommitId']
  let [username, sitename] = path.split('/').filter(x => x)

  let projectId = _.get(
    personalSitePathMap,
    [`${username}/${sitename}`, 'projectId'],
    defaultSiteProjectId
  )
  let ref =
    _.get(
      personalSitePathMap,
      [`${username}/${sitename}`, 'lastCommitId'],
      defaultSiteLastCommitId
    ) || 'master'
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

const getFileListByPath = (rootGetters, path) => {
  let [username, name] = path.split('/').filter(x => x)
  let projectId = rootGetters['gitlab/getProjectIdByPath'](path)
  if (!projectId) return []

  let repositoryTrees = rootGetters['gitlab/repositoryTrees']
  let fileList = _.get(repositoryTrees, [projectId, `${username}/${name}`], [])
  return fileList
}

/*doc
  getFileFullPathByPath

  add .md on path automatically
  if the path is a dir, try index.md, if it's a file, return path directly
  otherwise, return null
*/

const getFileFullPathByPath = (rootGetters, path) => {
  let fileList = rootGetters['gitlab/getFileListByPath'](path)
  let filesMapByPath = _.keyBy(fileList, 'path')

  let targetPath = path.replace(/^\/*/, '')
  let targetMarkdownFilePath = suffixFileExtension(targetPath, 'md')
  let targetIndexMarkdownFilePath = suffixFileExtension(
    targetPath + '/index',
    'md'
  )

  let targetFile = filesMapByPath[targetPath]
  let targetMarkdownFile = filesMapByPath[targetMarkdownFilePath]
  let targetIndexMarkdownFile = filesMapByPath[targetIndexMarkdownFilePath]

  let targetFiles = [targetFile, targetMarkdownFile, targetIndexMarkdownFile]
  let fullPath
  for (let i in targetFiles) {
    let file = targetFiles[i]
    if (file && file.type === 'blob') {
      fullPath = file.path
      break
    }
  }

  return fullPath
}

const getFileByPath = (rootGetters, path) => {
  let fullPath = rootGetters['gitlab/getFileFullPathByPath'](path)
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
  getFileListByPath: (state, getters, rootState, rootGetters) => path => {
    return getFileListByPath(rootGetters, path)
  },
  getFileFullPathByPath: (state, getters, rootState, rootGetters) => path => {
    return getFileFullPathByPath(rootGetters, path)
  },
  getFileByPath: (state, getters, rootState, rootGetters) => path => {
    return getFileByPath(rootGetters, path)
  }
}

export default getters
