const axios = require('axios')
const { getSearchableContent } = require('./index')

const gitlabAxiosInstance = axios.create({
  baseURL: 'https://api.keepwork.com/git/v0',
  timeout: 30 * 1000
})

const getContentFromGitlab = async path => {
  let pathArr = path.split('/')
  let projectPath = pathArr[1] + '/' + pathArr[2]
  let encodedProjectPath = encodeURIComponent(projectPath)
  let encodedPath = encodeURIComponent(path)
  let result = await gitlabAxiosInstance
    .get(`projects/${encodedProjectPath}/files/${encodedPath}.md`)
    .catch()
  let content = result.data.content
  return content
}

const getSearchableContentByPath = async path => {
  let content = await getContentFromGitlab(path)
  return getSearchableContent(content)
}

module.exports = { getSearchableContentByPath }
