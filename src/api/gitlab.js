import axios from 'axios'
import gitLabAPIGenerator from 'node-gitlab-api'
import { Base64 } from 'js-base64'

const defaultConfig = {
  url: process.env.GITLAB_API_PREFIX,
  token: ' '
}

export const showRawForGuest = async (
  rawBaseUrl,
  dataSourceUsername,
  projectName,
  fullPath
) => {
  let url = `${rawBaseUrl}/${dataSourceUsername}/${projectName}/raw/master/${fullPath}?_random=${Math.random()}`
  let { data: content = '' } = await axios.get(url)
  return content
}

export const newGitlabAPI = params => {
  let api = gitLabAPIGenerator({
    ...defaultConfig,
    ...params
  })
  return api
}

export class GitlabClient {
  constructor(config) {
    this.config = config
    this.client = newGitlabAPI({
      url: this.config.rawBaseUrl,
      token: this.config.token
    })
    this.upserrtHook(process.env.ELASTICSEARCH_BASE_URL + 'gitlab/webhook')
  }

  async getFile(path) {
    return this.client.projects.repository.files
      .show(this.config.projectId, path, this.config.ref)
      .then(file => file)
  }

  async getContent(path) {
    return this.client.projects.repository.files
      .show(this.config.projectId, path, this.config.ref)
      .then(file => Base64.decode(file.content))
  }

  async createFile(path, options) {
    options = { ...(options || {}), commit_message: 'create' }
    return this.client.projects.repository.files.create(
      this.config.projectId,
      path,
      this.config.branch || 'master',
      options
    )
  }

  async editFile(path, options) {
    options = { ...(options || {}), commit_message: 'edit' }
    return this.client.projects.repository.files.edit(
      this.config.projectId,
      path,
      this.config.branch || 'master',
      options
    )
  }

  async deleteFile(path, options) {
    options = { ...(options || {}), commit_message: 'delete' }
    return this.client.projects.repository.files.remove(
      this.config.projectId,
      path,
      this.config.branch,
      options
    )
  }

  async upsertFile(path, options) {
    options = { ...(options || {}) }
    const file = await this.getFile(path).catch(e => {})
    return file ? this.editFile(path, options) : this.createFile(path, options)
  }

  getFileGitUrl(path) {
    return `${this.config.rawBaseUrl}/${this.config.externalUsername}/${
      this.config.projectName
    }/blob/master/${path}`
  }

  async upserrtHook(url, options) {
    const hooks = await this.client.projects.hooks.all(
      this.config.projectId,
      options
    )
    const index = hooks.findIndex(hook => hook.url === url)
    return index >= 0
      ? hooks[index]
      : this.client.projects.hooks.add(this.config.projectId, url, options)
  }
}

export default {
  newGitlabAPI,
  showRawForGuest,
  GitlabClient
}
