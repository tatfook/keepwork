import axios from 'axios'
import gitLabAPIGenerator from 'node-gitlab-api'

const defaultConfig = {
  url: process.env.GITLAB_API_PREFIX,
  token: ' '
}

export const showRawForGuest = async (rawBaseUrl, dataSourceUsername, projectName, fullPath) => {
  let url = `${rawBaseUrl}/${dataSourceUsername}/${projectName}/raw/master/${fullPath}?_random=${Math.random()}`
  let { data: content = '' } = await axios.get(url)
  return content
}

export const newGitlabAPI = (params) => {
  let api = gitLabAPIGenerator({
    ...defaultConfig,
    ...params
  })
  return api
}

const gitlab = newGitlabAPI()
console.log('gitlab: ', gitlab)

export default {
  newGitlabAPI,
  showRawForGuest
}
