import axios from 'axios'

const gitLabAPIGenerator = ({ url, token }) => {
  const instance = axios.create({
    baseURL: url + '/api/v4/',
    timeout: 2000,
    headers: { 'private-token': token }
  })
  return {
    projects: {
      repository: {
        async tree(projectId, options) {
          const [pId, path] = [projectId, options.path].map(encodeURIComponent)
          // http://git.stage.keepwork.com/projects/283/repository/tree?id=283&page=2&path=kevinxft%2Fds&per_page=20&recursive=true
          try {
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
            // http://git.stage.keepwork.com/api/v4/projects/294/repository/files/kevinxft%2Fprivate%2F3123123.md?branch=master&content=%0A&commit_message=keepwork%20commit%3A%20kevinxft%2Fprivate%2F3123123.md
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            return instance.delete(`projects/${pId}/repository/files/${path}?branch=master&content=%0A&commit_message=keepwork%20commit%3A%20${path}`)
          },
          async show(projectId, filePath, ref) {
            const [pId, path] = [projectId, filePath].map(encodeURIComponent)
            // http://git.stage.keepwork.com/api/v4/projects/283/repository/files/kevinxft%2Fds%2F1313113.md?ref=master
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

export default gitLabAPIGenerator
