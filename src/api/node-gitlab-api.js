import axios from 'axios'

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
          try {
            const [pId, path] = [projectId, options.path].map(
              encodeURIComponent
            )
            let res = await instance.get(
              `projects/${pId}/repository/tree?id=${pId}&path=${path}&per_page=30&recursive=${options.recursive ||
                true}`
            )
            return res.data
          } catch (error) {
            return error
          }
        },
        files: {
          remove: async (projectId, filePath, branch, options) => {
            try {
              const [pId, path] = [projectId, filePath].map(encodeURIComponent)
              await instance.delete(
                `projects/${pId}/repository/files/${path}?branch=master&content=%0A&commit_message=keepwork%20commit%3A%20${path}`
              )
              return true
            } catch (error) {
              return error
            }
          },
          async show(projectId, filePath, ref) {
            try {
              const [pId, path] = [projectId, filePath].map(encodeURIComponent)
              let res = await instance.get(
                `projects/${pId}/repository/files/${path}?ref=${ref}`
              )
              return res.data
            } catch (error) {
              return error
            }
          },
          async showRaw(projectId, filePath, ref) {
            try {
              const [pId, path] = [projectId, filePath].map(encodeURIComponent)
              let res = await instance.get(
                `projects/${pId}/repository/files/${path}/raw?ref=${ref}`
              )
              return res.data
            } catch (error) {
              return error
            }
          },
          async create(projectId, filePath, branch = 'master', options) {
            try {
              const [pId, path] = [projectId, filePath].map(encodeURIComponent)
              let res = await instance.post(
                `projects/${pId}/repository/files/${path}`,
                {
                  branch,
                  ...options
                }
              )
              return res.data
            } catch (error) {
              return error
            }
          },
          async edit(projectId, filePath, branch = 'master', options) {
            try {
              const [pId, path] = [projectId, filePath].map(encodeURIComponent)
              let res = await instance.put(
                `projects/${pId}/repository/files/${path}`,
                {
                  branch,
                  ...options
                }
              )
              return res.data
            } catch (error) {
              return error
            }
          }
        }
      }
    }
  }
}

export default gitLabAPIGenerator
