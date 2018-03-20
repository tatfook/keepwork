import gitLabAPIGenerator from 'node-gitlab-api'

const defaultConfig = {
  url: process.env.GITLAB_API_PREFIX,
  token: ''
}

export const newGitlabAPI = (params) => gitLabAPIGenerator({
  ...defaultConfig,
  ...params
})

const gitlab = newGitlabAPI()

export default gitlab
