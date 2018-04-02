import _ from 'lodash'
import { Base64 } from 'js-base64'
import { props } from './mutations'
import {
  EMPTY_GIT_FOLDER_KEEPER,
  getFileFullPathByPath
} from '@/lib/utils/gitlab'

const {
  GET_ALL_PROJECTS_SUCCESS,
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
  let { dispatch, getters: { getGitlabAPI, getGitFileOptionsByPath } } = context
  let [username, name] = path.split('/').filter(x => x)

  // call user/getAllPersonalSite then we can get git file options
  await dispatch('user/getAllPersonalSite', null, { root: true })
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
  let { username, name, ref, branch, gitlab, projectId, options } = await getGitlabParams(context, { path: inputPath, content })
  let path = getFileFullPathByPath(inputPath)

  return { username, name, ref, branch, gitlab, projectId, options, path }
}

const actions = {
  async getAllProjects(context, payload) {
    let { commit, getters: { getGitlabAPI } } = context

    let gitlab = getGitlabAPI()
    let list = await gitlab.projects.all(payload)
    commit(GET_ALL_PROJECTS_SUCCESS, list)
  },
  async getRepositoryTree(context, payload) {
    let { path, ignoreCache = false, recursive = true } = payload
    let { commit, getters: { repositoryTrees } } = context
    let { gitlab, projectId } = await getGitlabParams(context, { path })
    let children = _.get(repositoryTrees, [projectId, path])

    if (!ignoreCache && !_.isEmpty(children)) return Promise.resolve()

    let list = await gitlab.projects.repository.tree(projectId, {
      path,
      recursive
    })
    commit(GET_REPOSITORY_TREE_SUCCESS, { projectId, path, list })
  },
  async readFile(context, { path: inputPath }) {
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
  async saveFile(context, { path: inputPath, content }) {
    let { commit } = context
    let {
      gitlab,
      projectId,
      branch,
      path,
      options
    } = await getGitlabFileParams(context, { path: inputPath, content })

    await gitlab.projects.repository.files.edit(
      projectId,
      path,
      branch,
      options
    )
    let payload = { path, branch }
    commit(SAVE_FILE_CONTENT_SUCCESS, payload)
  },
  async createFile(context, { path, content = '\n' }) {
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

    await dispatch('getRepositoryTree', {
      path: `${username}/${name}`,
      ignoreCache: true
    })
  },
  async addFolder({ dispatch }, { path }) {
    let newEmptyFilePath = `${path}/${EMPTY_GIT_FOLDER_KEEPER}`
    await dispatch('createFile', { path: newEmptyFilePath })
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

    await dispatch('getRepositoryTree', {
      path: `${username}/${name}`,
      ignoreCache: true
    })
  }
}

export default actions
