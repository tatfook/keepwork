import axios from 'axios'
import gitLabAPIGenerator from './node-gitlab-api'
import { Base64 } from 'js-base64'
import es from './elasticsearch'

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
    this.client.projects.repository.files.create(
      this.config.projectId,
      path,
      this.config.branch || 'master',
      options
    ).then((data) => {
      this.commitToES(path, 'create', options.content, {})
      return data
    })
  }

  async editFile(path, options) {
    options = { ...(options || {}), commit_message: 'edit' }
    this.client.projects.repository.files.edit(
      this.config.projectId,
      path,
      this.config.branch || 'master',
      options
    ).then((data) => {
      this.commitToES(path, 'edit', options.content, {})
      return data
    })
  }

  async deleteFile(path, options) {
    options = { ...(options || {}), commit_message: 'delete' }
    this.client.projects.repository.files.remove(
      this.config.projectId,
      path,
      this.config.branch,
      options
    ).then((data) => {
      this.commitToES(path, 'delete', '', {})
      return data
    })
  }

  async upsertFile(path, options) {
    options = { ...(options || {}) }
    const file = await this.getFile(path).catch(e => {})
    return file ? this.editFile(path, options) : this.createFile(path, options)
  }

  getFileGitUrl(path) {
    return `${this.config.rawBaseUrl}/${this.config.externalUsername}/${this.config.projectName}/blob/master/${path}`
  }

  async commitToES(path, action, content, options) {
    console.log('try commit to es')
    return es.submitGitData(path, action, content, options)
  }
}

export default {
  newGitlabAPI,
  showRawForGuest,
  GitlabClient
}
