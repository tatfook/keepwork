import axios from 'axios'
import { get as _get } from 'lodash'
import Cookies from 'js-cookie'

const defaultConfig = {
  url: process.env.KEEPWORK_API_PREFIX,
  token: ' '
}

const gitLabAPIGenerator = ({ url, token }) => {
  const instance = axios.create({
    baseURL: url,
    timeout: 30 * 1000,
    headers: { Authorization: token }
  })

  instance.interceptors.response.use(
    response => response,
    async error => {
      const CODES = [401]
      if (
        CODES.some(code => code === _get(error, 'response.status', '')) &&
        Cookies.get('token')
      ) {
        Cookies.remove('token')
        Cookies.remove('token', { path: '/' })
        window.localStorage.removeItem('satellizer_token')
        window.location.reload()
      }
      return Promise.reject(error)
    }
  )

  return {
    projects: {
      repository: {
        async tree(_projectName, _path, recursive = true) {
          const [projectName, path] = [_projectName, _path].map(
            encodeURIComponent
          )
          const res = await instance.get(
            `repos/${projectName}/tree?folderPath=${path}&recursive=${recursive}`
          )
          return res.data
        },
        files: {
          getFileCommitList: async ({
            projectPath,
            filePath,
            page,
            perPage
          }) => {
            projectPath = encodeURIComponent(projectPath)
            filePath = encodeURIComponent(filePath)
            let res = await instance.get(
              `repos/${projectPath}/commits/${filePath}?page=${page}&per_page=${perPage}`
            )
            return res
          },
          remove: async (projectName, filePath) => {
            const [projectPath, path] = [projectName, filePath].map(
              encodeURIComponent
            )
            await instance.delete(`repos/${projectPath}/files/${path}`)
            return true
          },
          async show({ projectPath, fullPath, showVersion = false, useCache }) {
            projectPath = encodeURIComponent(projectPath)
            fullPath = encodeURIComponent(fullPath)
            const url = `repos/${projectPath}/files/${fullPath}${showVersion ? '?commit=true' : ''}`
            let res = await instance.get(url).catch(error => Promise.reject(error))
            return res.data
          },
          async showWithCommitId({
            projectPath,
            fullPath,
            useCache,
            commitId
          }) {
            projectPath = encodeURIComponent(projectPath)
            fullPath = encodeURIComponent(fullPath)
            let res = await instance.get(
              `repos/${projectPath}/files/${fullPath}?ref=${commitId}`
            )
            return res.data
          },
          async showRaw(projectId, filePath, ref) {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            let res = await instance.get(
              `repos/${pId}/repository/files/${path}/raw?ref=${ref}`
            )
            return res.data
          },
          async create(projectName, filePath, content) {
            const [projectPath, path] = [projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.post(
              `repos/${projectPath}/files/${path}`,
              {
                content: content || ''
              }
            )
            return res.data
          },
          async createMultiple(_projectName, filesPayload) {
            const projectName = encodeURIComponent(_projectName)
            let res = await instance.post(`projects/${projectName}/files`, {
              files: filesPayload
            })
            return res.data
          },
          async edit(_projectName, filePath, content, source_version) {
            const [projectName, path] = [_projectName, filePath].map(
              encodeURIComponent
            )
            let res = await instance.put(
              `repos/${projectName}/files/${path}`,
              {
                content,
                source_version
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
              `repos/${projectPath}/files/${currentFilePath}/move`,
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
              `repos/${projectPath}/folders/${path}`
            )
            return res.data
          },
          async rename(projectName, folderPath, newFolderPath) {
            const [projectPath, path] = [projectName, folderPath].map(
              encodeURIComponent
            )
            let res = await instance.put(
              `repos/${projectPath}/folders/${path}/move`,
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
              `repos/${projectPath}/folders/${path}`
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

  async getTree({ projectName, path, recursive = true }) {
    projectName =
      projectName ||
      path
        .split('/')
        .splice(0, 2)
        .join('/')
    return this.client.projects.repository.tree(projectName, path, recursive)
  }

  async getFile({ projectPath, fullPath, useCache = false, showVersion = false }) {
    return this.client.projects.repository.files
      .show({ projectPath, fullPath, useCache, showVersion })
      .then(file => file)
  }

  async getFileWithCommitId({
    projectPath,
    fullPath,
    useCache = false,
    commitId
  }) {
    return this.client.projects.repository.files
      .showWithCommitId({ projectPath, fullPath, useCache, commitId })
      .then(file => file)
  }

  async getContent(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    return this.client.projects.repository.files
      .show({ projectPath: projectName, fullPath: path, useCache: false })
      .then(file => file.content)
  }

  async createFile({ projectName, path, options }) {
    projectName =
      projectName ||
      path
        .split('/')
        .splice(0, 2)
        .join('/')
    let content = options.content || ''
    return this.client.projects.repository.files
      .create(projectName, path, content)
      .then(data => {
        return data
      })
  }

  async getFileCommitList({ projectPath, filePath, page, perPage }) {
    return this.client.projects.repository.files
      .getFileCommitList({ projectPath, filePath, page, perPage })
      .then(data => data)
  }

  async createMultipleFile({ projectName, files }) {
    return this.client.projects.repository.files
      .createMultiple(projectName, files)
      .then(data => {
        return data
      })
  }

  async editFile(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    const content = options.content || ''
    const source_version = options.source_version
    return this.client.projects.repository.files
      .edit(projectName, path, content, source_version)
      .then(data => {
        return data
      })
  }

  async deleteFile(path, options) {
    const projectName = path
      .split('/')
      .splice(0, 2)
      .join('/')
    return this.client.projects.repository.files
      .remove(projectName, path)
      .then(data => {
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
    const file = await this.getFile(path).catch(e => { })
    return file ? this.editFile(path, options) : this.createFile(path, options)
  }

  getFileGitUrl(path) {
    return `${this.config.url}/${this.config.externalUsername}/${
      this.config.projectName
    }/blob/master/${path}`
  }
}

export default GitAPI
