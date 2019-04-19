const axios = require('axios')
const { getSearchableContent } = require('./index')

const gitlabAxiosInstance = axios.create({
  baseURL: process.env.GITLAB_API_PREFIX,
  timeout: 30 * 1000
})

const getContentFromGitlab = async path => {
  let content = await gitlabAxiosInstance.get(path).catch()
  return content
}

const getSearchableContentByPath = async path => {
  let content = await getContentFromGitlab(path)
  console.log(content)
  return getSearchableContent(content)
}

module.exports = { getSearchableContentByPath }
