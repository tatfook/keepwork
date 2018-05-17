import axios from 'axios'
import Cookies from 'js-cookie'

const client = axios.create({
  baseURL: process.env.ES_GATEWAY_BASE_URL
})

// TODO
// FIXME, should pass token through the options parameter
const tokenConfig = () => {
  return { headers: { Authorization: 'Bearer ' + Cookies.get('token') } }
}

export const search = async options => {
  const result = await client.post('es/search', options, tokenConfig())
  return result.data
}

export const submitGitData = async (path, action, content, options) => {
  return client.post('git/commit', {path, action, content, options}, tokenConfig())
}

export default {
  search,
  submitGitData
}
