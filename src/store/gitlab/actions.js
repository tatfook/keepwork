import _ from 'lodash'
import { Base64 } from 'js-base64'
import { props } from './mutations'

const {
  GET_ALL_PROJECTS_SUCCESS,
  GET_FILE_CONTENT_SUCCESS,
  SAVE_FILE_CONTENT_SUCCESS,
  GET_REPOSITORY_TREE_SUCCESS
} = props

const actions = {
  async getAllProjects(context, payload) {
    let { commit, getters: { getGitlabAPI } } = context

    let gitlab = getGitlabAPI()
    let list = await gitlab.projects.all(payload)
    commit(GET_ALL_PROJECTS_SUCCESS, list)
  },
  async getRepositoryTree(context, payload) {
    let { commit, getters: { getGitlabAPI, repositoryTrees } } = context
    let { projectId, path } = payload
    let children = _.get(repositoryTrees, [projectId, path])

    if (!_.isEmpty(children)) return Promise.resolve()

    let gitlab = getGitlabAPI()
    let list = await gitlab.projects.repository.tree(projectId, payload)
    commit(GET_REPOSITORY_TREE_SUCCESS, { projectId, path, list })
  },
  async getFileContent(context, path) {
    let { commit, dispatch, getters: { getGitlabAPI, getGitFileOptionsByPath } } = context

    // call user/getAllPersonalSite then we can get git file options
    await dispatch('user/getAllPersonalSite', null, {root: true})
    let { projectId, ref } = getGitFileOptionsByPath(path)

    let gitlab = getGitlabAPI()
    let file = await gitlab.projects.repository.files.show(projectId, path, ref)

    let payload = { path, file: {...file, content: Base64.decode(file.content)} }
    commit(GET_FILE_CONTENT_SUCCESS, payload)
  },
  async saveFileContent(context, {path, content}) {
    let { commit, dispatch, getters: { getGitlabAPI, getGitFileOptionsByPath } } = context

    // call user/getAllPersonalSite then we can get git file options
    await dispatch('user/getAllPersonalSite', null, {root: true})
    let { projectId } = getGitFileOptionsByPath(path)
    let branch = 'master'

    let gitlab = getGitlabAPI()
    let options = {content, commit_message: `update with vue editor`}
    let file = await gitlab.projects.repository.files.edit(projectId, path, branch, options)

    let payload = { path, file: {...file, content: Base64.decode(file.content)} }
    commit(SAVE_FILE_CONTENT_SUCCESS, payload)
  }
}

export default actions
