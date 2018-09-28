import axios from 'axios'
import { Base64 } from 'js-base64'
import es from './esGateway'

const defaultConfig = {
  url: process.env.GITLAB_API_PREFIX,
  token: ' '
}

const gitLabAPIGenerator = ({ url, token }) => {
  const instance = axios.create({
    baseURL: url,
    timeout: 30 * 1000,
    headers: { Authorization: token }
  })
  return {
    projects: {
      repository: {
        async tree(projectId, options) {
          const [pId, path] = [projectId, options.path].map(encodeURIComponent)
          let total = []
          let page = 0
          let res = {}
          if (!projectId) {
            // FIXME: 暂时这么去兼容老的api
            res = await instance.get(`projects/${path}/tree/${path}`)
            total = [...total, ...res.data]
            while (res.data.length >= 100) {
              res = await instance.get(
                `projects/${path}/tree/${path}?page=${page++}&per_page=100&recursive=${options.recursive ||
                  true}`
              )
              total = [...total, ...res.data]
            }
          } else {
            // 老方法
            res = await instance.get(
              `projects/${pId}/repository/tree?id=${pId}&path=${path}&page=${page++}&per_page=100&recursive=${options.recursive ||
                true}`
            )
            total = [...total, ...res.data]
            while (res.data.length >= 100) {
              res = await instance.get(
                `projects/${pId}/repository/tree?id=${pId}&path=${path}&page=${page++}&per_page=100&recursive=${options.recursive ||
                  true}`
              )
              total = [...total, ...res.data]
            }
          }
          return total
        },
        files: {
          remove: async (projectId, filePath, branch, options) => {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            await instance.delete(
              `projects/${pId}/repository/files/${path}?branch=master&content=%0A&commit_message=keepwork%20commit%3A%20${path}`
            )
            return true
          },
          async show(_projectName, filePath, ref) {
            const [projectName, path] = [_projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.get(
              `projects/${projectName}/files/${path}`
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
          async create(_projectName, filePath, branch = 'master', options) {
            console.log(options)
            const [projecName, path] = [_projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.post(
              `projects/${projecName}/files/${path}`,
              {
                content: options.content || ''
              }
            )
            return res.data
          },
          async edit(_projectName, filePath, branch = 'master', options) {
            const [projectName, path] = [_projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.put(
              `projects/${projectName}/repository/files/${path}`,
              {
                branch,
                ...options
              }
            )
            return res.data
          },
          async rename(_projectName, _currentFilePath, _newFilePath, content = '') {
            const [projectName, currentFilePath, newFilePath] = [_projectName, _currentFilePath, _newFilePath].map(encodeURIComponent)
            let res = await instance.post(
              `projects/${projectName}/files/${currentFilePath}/move`,
              {
                new_path: newFilePath,
                content
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
    return this.client.projects.repository.tree(
      options.projectId || this.config.projectId,
      options
    )
  }

  async getFile(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    return this.client.projects.repository.files
      .show(projectName, path)
      .then(file => file)
  }

  async getContent(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    return this.client.projects.repository.files
      .show(projectName, path)
      .then(file => file.content)
  }

  async createFile(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    options = { ...(options || {}), commit_message: 'create' }
    return this.client.projects.repository.files
      .create(projectName, path, options)
      .then(data => {
        this.commitToES(path, 'create', options.content, {})
        return data
      })
  }

  async editFile(path, options) {
    options = { ...(options || {}), commit_message: 'edit' }
    return this.client.projects.repository.files
      .edit(
        options.projectId || this.config.projectId,
        path,
        options.branch || this.config.branch || 'master',
        options
      )
      .then(data => {
        this.commitToES(path, 'edit', options.content, {})
        return data
      })
  }

  async deleteFile(path, options) {
    options = { ...(options || {}), commit_message: 'delete' }
    return this.client.projects.repository.files
      .remove(
        options.projectId || this.config.projectId,
        path,
        options.branch || this.config.branch || 'master',
        options
      )
      .then(data => {
        this.commitToES(path, 'delete', '', {})
        return data
      })
  }

  async renameFile(currentFilePath, newFilePath, options) {
    let content = await this.getContent(currentFilePath, options)
    const projectName = currentFilePath
      .split('/')
      .splice(0, 2)
      .join('/')
    await this.client.projects.repository.files
      .rename(projectName, currentFilePath, newFilePath, content)
      .then(data => {
        // this.commitToES(newFilePath, 'create', content, {})
        // this.commitToES(currentFilePath, 'delete', '', {})
        return data
      })
  }
  async genActions(curPath, newPath, child, options) {
    let num = child.length
    let actions = []
    while (num--) {
      let content = /\.gitignore.md$/.test(child[num])
        ? '↵'
        : await this.getContent(child[num], options)
      actions.push({
        action: 'move',
        file_path: child[num].replace(curPath, newPath),
        previous_path: child[num],
        content
      })
    }
    return actions
  }

  async renameFolder(currentFolderPath, newFolderPath, childrenFiles, options) {
    let actions = await this.genActions(
      currentFolderPath,
      newFolderPath,
      childrenFiles,
      options
    )
    let payload = {
      branch: options.branch || this.config.branch || 'master',
      commit_message: 'rename folder',
      actions
    }
    await this.client.projects.repository.files
      .rename(options.projectId, payload)
      .then(data => {
        this.commitToESByArray(actions, options)
        return data
      })
      .catch(e => {})
  }

  async upsertFile(path, options) {
    options = { ...(options || {}) }
    const file = await this.getFile(path).catch(e => {})
    return file ? this.editFile(path, options) : this.createFile(path, options)
  }

  getFileGitUrl(path) {
    return `${this.config.url}/${this.config.externalUsername}/${
      this.config.projectName
    }/blob/master/${path}`
  }

  async commitToES(path, action, content, options) {
    return es.submitGitData(path, action, content, options)
  }

  async commitToESByArray(actions, options) {
    actions.map(action => {
      this.commitToES(action.file_path, 'create', action.content, {})
      this.commitToES(action.previous_path, 'delete', '', {})
      return null
    })
  }
}

export default GitAPI
