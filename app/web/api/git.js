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
            res = await instance.get(
              `projects/${path}/tree/${path}?recursive=true`
            )
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
          remove: async (projectName, filePath) => {
            const [projectPath, path] = [projectName, filePath].map(
              encodeURIComponent
            )
            await instance.delete(`projects/${projectPath}/files/${path}`)
            return true
          },
          async show(projectName, filePath) {
            const [projectPath, path] = [projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.get(
              `projects/${projectPath}/files/${path}`
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
          async create(projectName, filePath, content) {
            const [projectPath, path] = [projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.post(
              `projects/${projectPath}/files/${path}`,
              {
                content: content || ''
              }
            )
            return res.data
          },
          async edit(_projectName, filePath, content) {
            const [projectName, path] = [_projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.put(
              `projects/${projectName}/files/${path}`,
              {
                content
              }
            )
            return res.data
          },
          async rename(
            projectName,
            _currentFilePath,
            newFilePath,
            content = ''
          ) {
            const [projectPath, currentFilePath] = [
              projectName,
              _currentFilePath
            ].map(encodeURIComponent)
            let res = await instance.put(
              `projects/${projectPath}/files/${currentFilePath}/move`,
              {
                new_path: newFilePath,
                content
              }
            )
            return res.data
          }
        },
        folders: {
          async create(projectName, folderPath) {
            const [projectPath, path] = [projectName, folderPath].map(
              encodeURIComponent
            )
            let res = await instance.post(
              `projects/${projectPath}/folders/${path}`
            )
            return res.data
          },
          async rename(projectName, folderPath, newFolderPath) {
            const [projectPath, path] = [projectName, folderPath].map(
              encodeURIComponent
            )
            console.warn(projectPath)
            let res = await instance.put(
              `projects/${projectPath}/folders/${path}/move`,
              {
                new_path: newFolderPath
              }
            )
            return res.data
          },
          async remove(projectName, folderPath) {
            const [projectPath, path] = [projectName, folderPath].map(
              encodeURIComponent
            )
            let res = await instance.delete(
              `projects/${projectPath}/folders/${path}`
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
    return (
      this.client.projects.repository.files
        .show(projectName, path)
        // .then(file => Base64.decode(file.content))
        .then(file => file.content)
    )
  }

  async createFile(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    let content = options.content || ''
    return this.client.projects.repository.files
      .create(projectName, path, content)
      .then(data => {
        // this.commitToES(path, 'create', options.content, {})
        return data
      })
  }

  async editFile(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    const content = options.content || ''
    return this.client.projects.repository.files
      .edit(projectName, path, content)
      .then(data => {
        // this.commitToES(path, 'edit', options.content, {})
        return data
      })
  }

  async deleteFile(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    // options = { ...(options || {}), commit_message: 'delete' }
    return this.client.projects.repository.files
      .remove(projectName, path)
      .then(data => {
        this.commitToES(path, 'delete', '', {})
        return data
      })
  }

  async renameFile(currentFilePath, newFilePath, options) {
    let content = (await this.getContent(currentFilePath, options)) || ''
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

  async createFolder(path) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    return this.client.projects.repository.folders
      .create(projectName, path)
      .then(data => {
        return data
      })
  }

  async renameFolder(currentFolderPath, newFolderPath, childrenFiles, options) {
    const projectName = currentFolderPath
      .split('/')
      .splice(0, 2)
      .join('/')
    await this.client.projects.repository.folders.rename(
      projectName,
      currentFolderPath,
      newFolderPath
    )
  }

  async removeFolder(folderPath) {
    const projectName = folderPath
      .split('/')
      .splice(0, 2)
      .join('/')
    await this.client.projects.repository.folders.remove(
      projectName,
      folderPath
    )
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
      // this.commitToES(action.file_path, 'create', action.content, {})
      // this.commitToES(action.previous_path, 'delete', '', {})
      return null
    })
  }
}

export default GitAPI
