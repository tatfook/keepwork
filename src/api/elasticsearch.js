import axios from 'axios'

const client = axios.create({ baseURL: process.env.ELASTICSEARCH_BASE_URL })

const search = async options => {
  const result = await client.post('elasticsearch/search', options)
  return result.data
}

export default {
  search
}
