import gitLabAPIGenerator from 'node-gitlab-api'

const defaultConfig = {
  url: process.env.GITLAB_API_PREFIX
}

export const newGitlabAPI = (params) => gitLabAPIGenerator({
  ...defaultConfig,
  ...params
})

const gitlab = newGitlabAPI({token: 'GB5sw41LBpCZFMb3ZhRx'})

export default gitlab
