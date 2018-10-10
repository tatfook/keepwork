import _ from 'lodash'
import uuid from '@/lib/utils/uuid'
import { Base64 } from 'js-base64'
import { GitAPI } from '@/api'
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
    getters: { getGitlabAPI },
    rootGetters
  } = context
  let [username, name] = path.split('/').filter(x => x)

  // call user/getAllPersonalAndContributedSite then we can get git file options
  await dispatch('user/getAllPersonalAndContributedSite', null, { root: true })

  let { 'user/getGitFileProjectIdAndRefByPath': getGitFileProjectIdAndRefByPath } = rootGetters
  let { projectId } = getGitFileProjectIdAndRefByPath(path)

  let gitlab = getGitlabAPI()
  let options = { projectId, ref, branch, content, commit_message: `keepwork commit: ${path}` }

  return { username, name, gitlab, options, projectId, path }
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
    gitlab,
    options
  } = await getGitlabParams(context, { path: inputPath, content })
  let path = getFileFullPathByPath(inputPath)

  return { username, name, gitlab, options, path }
}

const actions = {
  async getRepositoryTree({ dispatch }, payload) {
    let { editorMode = true } = payload
    editorMode
      ? await dispatch('getRepositoryTreeForOwner', payload)
      : await dispatch('getRepositoryTreeForGuest', payload)
  },
  async getRepositoryTreeForOwner(context, payload) {
    let { commit, getters: { repositoryTrees } } = context
    let { path, useCache = true, recursive = true } = payload
    let { gitlab, projectId } = await getGitlabParams(context, { path })

    let children = _.get(repositoryTrees, [projectId, path])
    if (useCache && !_.isEmpty(children)) return

    let list = await gitlab.getTree({
      projectId,
      path,
      recursive
    })
    commit(GET_REPOSITORY_TREE_SUCCESS, { projectId, path, list })
  },
  async getRepositoryTreeForGuest(context, payload) {
    let { commit, dispatch, getters: { repositoryTrees }, rootGetters } = context
    let { path, useCache = true, recursive = true } = payload
    await dispatch('user/getWebsiteDetailInfoByPath', { path }, { root: true })
    let {
      'user/getSiteDetailInfoDataSourceByPath': getSiteDetailInfoDataSourceByPath
    } = rootGetters
    let siteDetailInfoDataSource = getSiteDetailInfoDataSourceByPath(path)
    let { visibility } = siteDetailInfoDataSource

    // this is special for private website
    let isPrivateWebsite = visibility === 'private'
    if (isPrivateWebsite) {
      await dispatch('getRepositoryTreeForOwner', payload)
      return
    }

    let projectId = siteDetailInfoDataSource.projectId
    let gitlab = new GitAPI({ url: process.env.GITLAB_API_PREFIX, token: ' ' })

    let children = _.get(repositoryTrees, [projectId, path])
    if (useCache && !_.isEmpty(children)) return

    let list = await gitlab.getTree({
      projectId,
      path,
      recursive
    })
    commit(GET_REPOSITORY_TREE_SUCCESS, { projectId, path, list })
  },
  async readFile({ dispatch }, { path, editorMode }) {
    if (editorMode) {
      await dispatch('readFileForOwner', { path }).catch(
        e => dispatch('readFileForGuest', { path, forceAsGuest: true })
      )
    } else {
      await dispatch('readFileForGuest', { path })
    }
  },
  async readFileForOwner(context, { path: inputPath }) {
    let { commit } = context
    let { gitlab, path, options } = await getGitlabFileParams(context, {
      path: inputPath
    })
    let file = await gitlab.getFile(path, options)
    let markdownExtraLineToCheck404 = /\.md$/.test(path) ? '\n' : ''
    let payload = {
      path,
      // file: { ...file, content: Base64.decode(file.content) + markdownExtraLineToCheck404 }
      file: { ...file, content: file.content + markdownExtraLineToCheck404 }
    }
    commit(GET_FILE_CONTENT_SUCCESS, payload)
  },
  async readFileForGuest(context, { path, forceAsGuest = false }) {
    let { commit, dispatch, rootGetters } = context

    // load necessary info for guest to get the file content
    await dispatch('user/getWebsiteDetailInfoByPath', { path }, { root: true })
    let {
      'user/getSiteDetailInfoDataSourceByPath': getSiteDetailInfoDataSourceByPath
    } = rootGetters
    let {
      rawBaseUrl,
      dataSourceUsername,
      projectName,
      visibility
    } = getSiteDetailInfoDataSourceByPath(path)

    // this is special for private website
    let isPrivateWebsite = visibility === 'private'
    if (isPrivateWebsite) {
      if (forceAsGuest) throw new Error('Cannot read private sites without permission!')

      await dispatch('readFileForOwner', { path })
      return
    }

    let fullPath = getFileFullPathByPath(path)
    let content = await gitlabShowRawForGuest(
      rawBaseUrl,
      dataSourceUsername,
      projectName,
      fullPath
    )
    let markdownExtraLineToCheck404 = /\.md$/.test(fullPath) ? '\n' : ''
    content = typeof content === 'string' ? (content + markdownExtraLineToCheck404) : content
    let payload = { path: fullPath, file: { content } }
    commit(GET_FILE_CONTENT_SUCCESS, payload)
  },
  async saveFile(context, { path: inputPath, content }) {
    let { commit, dispatch } = context
    let {
      gitlab,
      path,
      options
    } = await getGitlabFileParams(context, { path: inputPath, content })
    await gitlab.editFile(path, {
      ...options,
      content: /\.md$/.test(path) ? content.replace(/\n$/, '') : content
    })
      .catch(async e => {
        console.error(e)
        // try create a new file
        await dispatch('createFile', { path: getFileFullPathByPath(inputPath), content })
      })
    let payload = { path, branch: options.branch }
    commit(SAVE_FILE_CONTENT_SUCCESS, payload)
  },
  async createFolder(
    context,
    { path, refreshRepositoryTree = true }
  ) {
    const { commit, dispatch } = context
    const {
      username,
      name,
      gitlab,
      options
    } = await getGitlabFileParams(context, { path })
    await gitlab.createFolder(path)

    if (refreshRepositoryTree) {
      await dispatch('getRepositoryTree', {
        path: `${username}/${name}`,
        useCache: false
      })
    }
  },
  async createFile(
    context,
    { path, content = '', refreshRepositoryTree = true, userOptions }
  ) {
    let { commit, dispatch } = context
    let {
      username,
      name,
      gitlab,
      options
    } = await getGitlabParams(context, { path, content })
    options = _.merge(userOptions, options)
    await gitlab.createFile(
      path,
      options
    )

    let payload = { path, branch: options.branch }
    commit(CREATE_FILE_CONTENT_SUCCESS, payload)

    if (refreshRepositoryTree) {
      await dispatch('getRepositoryTree', {
        path: `${username}/${name}`,
        useCache: false
      })
    }
  },
  async renameFile(context, { currentFilePath, newFilePath }) {
    const { dispatch } = context
    let {
      username,
      name,
      options,
      gitlab
    } = await getGitlabParams(context, { path: currentFilePath })
    await gitlab.renameFile(currentFilePath, newFilePath, options)
    await dispatch('user/renamePageFromConfig', { currentFilePath, newFilePath }, { root: true })
    await dispatch('closeOpenedFile', { path: currentFilePath }, { root: true })
    await dispatch('getRepositoryTree', {
      path: `${username}/${name}`,
      useCache: false
    })
  },
  async renameFolder(context, { currentFolderPath, newFolderPath, childrenFiles }) {
    const { dispatch } = context
    let { username, name, options, gitlab } = await getGitlabFileParams(context, { path: currentFolderPath })
    await gitlab.renameFolder(currentFolderPath, newFolderPath, childrenFiles, options)
    await dispatch('user/renamePagesFromConfig', { currentFolderPath, newFolderPath, childrenFiles }, { root: true })
    await dispatch('closeOpenedFile', { path: currentFolderPath }, { root: true })
    await dispatch('getRepositoryTree', {
      path: `${username}/${name}`,
      useCache: false
    })
  },
  async addFolder(
    context,
    { path, refreshRepositoryTree = true }
  ) {
    const { commit, dispatch } = context
    const {
      username,
      name,
      gitlab,
      options
    } = await getGitlabFileParams(context, { path })
    await gitlab.createFolder(path)

    if (refreshRepositoryTree) {
      await dispatch('getRepositoryTree', {
        path: `${username}/${name}`,
        useCache: false
      })
    }
  },
  async removeFolder(context, { folder, paths }) {
    const { commit, dispatch } = context
    const { username, name, options, gitlab } = await getGitlabFileParams(context, { path: folder })
    console.warn('gitlab', gitlab)
    paths.forEach(path => dispatch('closeOpenedFile', { path }, { root: true }))
    try {
      await gitlab.removeFolder(folder)
    } catch (error) {
      console.error(error)
    }
    // for (let i = 0; i < paths.length; i++) {
    //   let {
    //     gitlab,
    //     options
    //   } = await getGitlabFileParams(context, { path: paths[i] })
    //   try {
    //     await gitlab.deleteFile(paths[i], options)
    //     dispatch('closeOpenedFile', { path: paths[i] }, { root: true })
    //   } catch (error) {
    //     console.error(error)
    //   }
    // }
    // let path = paths[0]
    // let {
    //   username,
    //   name,
    //   options
    // } = await getGitlabFileParams(context, { path: paths[0] })
    let payload = { path: folder, branch: options.branch }
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
      gitlab,
      options
    } = await getGitlabParams(context, { path })
    await gitlab.deleteFile(
      path,
      options
    )

    let payload = { path, branch: options.branch }
    commit(REMOVE_FILE_SUCCESS, payload)

    dispatch('closeOpenedFile', { path }, { root: true })

    await dispatch('getRepositoryTree', {
      path: `${username}/${name}`,
      useCache: false
    })
  },
  async uploadFile({ dispatch, rootGetters, getters }, { fileName, content, sitePath }) {
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
    sitePath = sitePath || activePageUrl
    await dispatch(
      'user/getWebsiteDetailInfoByPath',
      { path: sitePath },
      { root: true }
    )
    const {
      rawBaseUrl,
      dataSourceUsername,
      projectName
    } = getSiteDetailInfoDataSourceByPath(sitePath)

    let { getGitlabAPI, getProjectIdByPath } = getters
    let projectId = getProjectIdByPath(sitePath)
    let options = {
      projectId,
      content,
      commit_message: `keepwork commit: ${path}`,
      encoding: 'base64'
    }
    let gitlab = getGitlabAPI()
    try {
      await gitlab.createFile(path, options)
      // let projectName = path.split('/').splice(0, 2).join('/')
      // return `${projectName}/raw/master/${path}}`
      return `${rawBaseUrl}/${dataSourceUsername}/${projectName}/raw/master${path}`
    } catch (e) {
      console.error(e)
    }
  }
}

export default actions
