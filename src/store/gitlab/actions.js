import _ from 'lodash'
import uuid from '@/lib/utils/uuid'
import { Base64 } from 'js-base64'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import { props } from './mutations'
import {
  EMPTY_GIT_FOLDER_KEEPER,
  getFileFullPathByPath
} from '@/lib/utils/gitlab'

const {
  GET_FILE_CONTENT_SUCCESS,
  SAVE_FILE_CONTENT_SUCCESS,
  CREATE_FILE_CONTENT_SUCCESS,
  GET_REPOSITORY_TREE_SUCCESS,
  REMOVE_FILE_SUCCESS
} = props

/*doc
  getGitlabParams

  return gitlab params for common usage
*/
const getGitlabParams = async (context, { path, content = '\n' }) => {
  let branch = 'master'
  let ref = branch
  let {
    dispatch,
    getters: { getGitlabAPI, getGitFileOptionsByPath }
  } = context
  let [username, name] = path.split('/').filter(x => x)

  // call user/getAllPersonalAndContributedSite then we can get git file options
  await dispatch('user/getAllPersonalAndContributedSite', null, { root: true })
  let { projectId } = getGitFileOptionsByPath(path)
  let gitlab = getGitlabAPI()
  let options = { content, commit_message: `keepwork commit: ${path}` }

  return { username, name, ref, branch, gitlab, projectId, options }
}

/*doc
  getGitlabFileParams

  add fullPath as path return with getGitlabParams results
*/
const getGitlabFileParams = async (
  context,
  { path: inputPath, content = '\n' }
) => {
  let {
    username,
    name,
    ref,
    branch,
    gitlab,
    projectId,
    options
  } = await getGitlabParams(context, { path: inputPath, content })
  let path = getFileFullPathByPath(inputPath)

  return { username, name, ref, branch, gitlab, projectId, options, path }
}

const actions = {
  async getRepositoryTree(context, payload) {
    let { path, useCache = true, recursive = true } = payload
    let {
      commit,
      getters: { repositoryTrees }
    } = context
    let { gitlab, projectId } = await getGitlabParams(context, { path })
    let children = _.get(repositoryTrees, [projectId, path])

    if (useCache && !_.isEmpty(children)) return

    let list = await gitlab.projects.repository.tree(projectId, {
      path,
      recursive
    })
    commit(GET_REPOSITORY_TREE_SUCCESS, { projectId, path, list })
  },
  async readFile({ dispatch }, { path, editorMode }) {
    editorMode
      ? await dispatch('readFileForOwner', { path })
      : await dispatch('readFileForGuest', { path })
  },
  async readFileForOwner(context, { path: inputPath }) {
    let { commit } = context
    let { gitlab, projectId, ref, path } = await getGitlabFileParams(context, {
      path: inputPath
    })
    let file = await gitlab.projects.repository.files.show(projectId, path, ref)

    let payload = {
      path,
      file: { ...file, content: Base64.decode(file.content) }
    }
    commit(GET_FILE_CONTENT_SUCCESS, payload)
  },
  async readFileForGuest(context, { path }) {
    let { commit, dispatch, rootGetters } = context

    // load necessary info for guest to get the file content
    await dispatch('user/getWebsiteDetailInfoByPath', { path }, { root: true })
    let {
      'user/getSiteDetailInfoDataSourceByPath': getSiteDetailInfoDataSourceByPath
    } = rootGetters
    let {
      rawBaseUrl,
      dataSourceUsername,
      projectName
    } = getSiteDetailInfoDataSourceByPath(path)

    let fullPath = getFileFullPathByPath(path)
    let content = await gitlabShowRawForGuest(
      rawBaseUrl,
      dataSourceUsername,
      projectName,
      fullPath
    )

    let payload = { path: fullPath, file: { content } }
    commit(GET_FILE_CONTENT_SUCCESS, payload)
  },
  async saveFile(context, { path: inputPath, content }) {
    let { commit, dispatch } = context
    let {
      gitlab,
      projectId,
      branch,
      path,
      options
    } = await getGitlabFileParams(context, { path: inputPath, content })
    await gitlab.projects.repository.files
      .edit(projectId, path, branch, options)
      .catch(async e => {
        console.error(e)
        // try create a new file
        await dispatch('createFile', { path: inputPath, content })
      })
    let payload = { path, branch }
    commit(SAVE_FILE_CONTENT_SUCCESS, payload)
  },
  async createFile(
    context,
    { path, content = '\n', refreshRepositoryTree = true }
  ) {
    let { commit, dispatch } = context
    let {
      username,
      name,
      branch,
      gitlab,
      projectId,
      options
    } = await getGitlabParams(context, { path, content })

    await gitlab.projects.repository.files.create(
      projectId,
      path,
      branch,
      options
    )

    let payload = { path, branch }
    commit(CREATE_FILE_CONTENT_SUCCESS, payload)

    if (refreshRepositoryTree) {
      await dispatch('getRepositoryTree', {
        path: `${username}/${name}`,
        useCache: false
      })
    }
  },
  async addFolder({ dispatch }, { path }) {
    let newEmptyFilePath = `${path}/${EMPTY_GIT_FOLDER_KEEPER}`
    await dispatch('createFile', { path: newEmptyFilePath })
  },
  async removeFolder(context, { paths }) {
    let { commit, dispatch } = context

    for (let i = 0; i < paths.length; i++) {
      let {
        branch,
        gitlab,
        projectId,
        options
      } = await getGitlabFileParams(context, { path: paths[i] })
      try {
        await gitlab.projects.repository.files.remove(projectId, paths[i], branch, options)
        dispatch('closeOpenedFile', { path: paths[i] }, {root: true})
      } catch (error) {
        console.error(error)
      }
    }
    // await Promise.all(paths.map(async path => {
    //   let {
    //     branch,
    //     gitlab,
    //     projectId,
    //     options
    //   } = await getGitlabFileParams(context, { path })
    //   return gitlab.projects.repository.files.remove(projectId, path, branch, options)
    // }))
    let path = paths[0]
    let {
      username,
      name,
      branch
    } = await getGitlabFileParams(context, {path: paths[0]})
    let payload = { path, branch }
    commit(REMOVE_FILE_SUCCESS, payload)

    await dispatch('getRepositoryTree', {
      path: `${username}/${name}`,
      useCache: false
    })
  },
  async removeFile(context, { path }) {
    let { commit, dispatch } = context
    let {
      username,
      name,
      branch,
      gitlab,
      projectId,
      options
    } = await getGitlabParams(context, { path })
    await gitlab.projects.repository.files.remove(
      projectId,
      path,
      branch,
      options
    )

    let payload = { path, branch }
    commit(REMOVE_FILE_SUCCESS, payload)

    dispatch('closeOpenedFile', { path }, { root: true })

    await dispatch('getRepositoryTree', {
      path: `${username}/${name}`,
      useCache: false
    })
  },
  async uploadFile({ dispatch, rootGetters, getters }, { fileName, content }) {
    let {
      activePageUrl,
      'user/username': username,
      'user/getSiteDetailInfoDataSourceByPath': getSiteDetailInfoDataSourceByPath
    } = rootGetters
    let path = '/' + username
    content = content.split(',')
    if (content.length > 1) {
      let fileType = content[0].match(/(image|video)\/([\w]+)/)
      content = content[1]
      if (fileType && fileType[2]) path = path + '_images/' + uuid() + fileName
      else path = path + '_files/' + uuid() + fileName
    } else {
      return // invalid file
    }
    let { getGitlabAPI, getProjectIdByPath } = getters
    let gitlab = getGitlabAPI()
    let options = {
      content,
      commit_message: `keepwork commit: ${path}`,
      encoding: 'base64'
    }

    await dispatch(
      'user/getWebsiteDetailInfoByPath',
      { path: activePageUrl },
      { root: true }
    )
    const {
      rawBaseUrl,
      dataSourceUsername,
      projectName
    } = getSiteDetailInfoDataSourceByPath(activePageUrl)

    let projectId = getProjectIdByPath(activePageUrl)
    try {
      await gitlab.projects.repository.files.create(
        projectId,
        path,
        'master',
        options
      )
      return `${rawBaseUrl}/${dataSourceUsername}/${projectName}/raw/master${path}`
    } catch (e) {
      console.error(e)
    }
  }
}

export default actions
