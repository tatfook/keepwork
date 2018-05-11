import axios from 'axios'

const client = axios.create({ baseURL: process.env.ELASTICSEARCH_BASE_URL })

export const search = async options => {
  const result = await client.post('es/search', options)
  return result.data
}

export const submitGitData = async (path, action, content, options) => {
  return client.post('git/commit', {path, action, content, options})
}

export default {
  search,
  submitGitData
}
