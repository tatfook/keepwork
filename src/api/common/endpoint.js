import _ from 'lodash'
import axios from 'axios'
import Cookies from 'js-cookie'

const DEFAULT_CONFIG = {
  baseURL: process.env.KEEPWORK_API_PREFIX,
  timeout: 2000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
  }
}

/*
return a wrapped endpoint.

@config {} endpoint config
@parseResponse true or false, return parsed data or the original response
*/
const createEndpoint = (config, parseResponse = true) => {
  let endpoint = axios.create(_.merge(DEFAULT_CONFIG, config))
  endpoint.interceptors.request.use(
    config => {
      if (Cookies.get('token')) {
        _.merge(config, { headers: { Authorization: 'Bearer ' + Cookies.get('token') } })
      }
      return config
    },
    error => {
      console.error(error)
      return Promise.reject(error)
    }
  )

  endpoint.interceptors.response.use(
    response => {
      return parseResponse ? response.data || response : response
    },
    error => {
      console.error(error.message)
      console.error(error.response.data)
      return Promise.resolve(error.response)
    }
  )

  return endpoint
}

export default createEndpoint
