import axios from 'axios'
import { Base64 } from 'js-base64'
import es from './esGateway'

const defaultConfig = {
  url: process.env.GITLAB_API_PREFIX,
  token: ' '
}

const gitLabAPIGenerator = ({ url, token }) => {
  const instance = axios.create({
    baseURL: url + '/api/v4/',
    timeout: 30 * 1000,
    headers: { 'private-token': token }
  })
  return {
    projects: {
      repository: {
        async tree(projectId, options) {
          const [pId, path] = [projectId, options.path].map(
            encodeURIComponent
          )
          let res = await instance.get(
            `projects/${pId}/repository/tree?id=${pId}&path=${path}&per_page=1000000&recursive=${options.recursive ||
                true}`
          )
          return res.data
        },
        files: {
          remove: async (projectId, filePath, branch, options) => {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            await instance.delete(
              `projects/${pId}/repository/files/${path}?branch=master&content=%0A&commit_message=keepwork%20commit%3A%20${path}`
            )
            return true
          },
          async show(projectId, filePath, ref) {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            let res = await instance.get(
              `projects/${pId}/repository/files/${path}?ref=${ref}`
            )
            return res.data
          },
          async showRaw(projectId, filePath, ref) {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            let res = await instance.get(
              `projects/${pId}/repository/files/${path}/raw?ref=${ref}`
            )
            return res.data
          },
          async create(projectId, filePath, branch = 'master', options) {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            let res = await instance.post(
              `projects/${pId}/repository/files/${path}`,
              {
                branch,
                ...options
              }
            )
            return res.data
          },
          async edit(projectId, filePath, branch = 'master', options) {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            let res = await instance.put(
              `projects/${pId}/repository/files/${path}`,
              {
                branch,
                ...options
              }
            )
            return res.data
          }
        }
      }
    }
  }
}
export class GitAPI {
  constructor(config) {
    this.config = config
    this.client = gitLabAPIGenerator({
      ...defaultConfig,
      url: this.config.url,
      token: this.config.token
    })
  }

  async getTree(options) {
    return this.client.projects.repository.tree(options.projectId || this.config.projectId, options)
  }

  async getFile(path, options) {
    return this.client.projects.repository.files
      .show(options.projectId || this.config.projectId, path, options.ref || this.config.ref || 'master')
      .then(file => file)
  }

  async getContent(path, options) {
    return this.client.projects.repository.files
      .show(options.projectId || this.config.projectId, path, options.ref || this.config.ref || 'master')
      .then(file => Base64.decode(file.content))
  }

  async createFile(path, options) {
    options = { ...(options || {}), commit_message: 'create' }
    return this.client.projects.repository.files.create(
      options.projectId || this.config.projectId,
      path,
      options.branch || this.config.branch || 'master',
      options
    ).then((data) => {
      this.commitToES(path, 'create', options.content, {})
      return data
    })
  }

  async editFile(path, options) {
    options = { ...(options || {}), commit_message: 'edit' }
    return this.client.projects.repository.files.edit(
      options.projectId || this.config.projectId,
      path,
      options.branch || this.config.branch || 'master',
      options
    ).then((data) => {
      this.commitToES(path, 'edit', options.content, {})
      return data
    })
  }

  async deleteFile(path, options) {
    options = { ...(options || {}), commit_message: 'delete' }
    return this.client.projects.repository.files.remove(
      options.projectId || this.config.projectId,
      path,
      options.branch || this.config.branch || 'master',
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
    return `${this.config.url}/${this.config.externalUsername}/${this.config.projectName}/blob/master/${path}`
  }

  async commitToES(path, action, content, options) {
    return es.submitGitData(path, action, content, options)
  }
}

export default GitAPI
