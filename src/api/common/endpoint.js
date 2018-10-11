import _ from 'lodash'
import axios from 'axios'
import Cookies from 'js-cookie'
import axiosRetry from 'axios-retry'
import { keepwork } from '@/api'

axiosRetry(axios, { retries: 3 })

const DEFAULT_CONFIG = {
  baseURL: process.env.KEEPWORK_API_PREFIX,
  timeout: 20000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
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
        _.merge(config, {
          headers: { Authorization: 'Bearer ' + Cookies.get('token') }
        })
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
      return parseResponse ? response.data.data || response.data : response.data
    },
    async error => {
      if (error.response.status === 401 && Cookies.get('token')) {
        await keepwork.user.getProfile().catch(e => {
          Cookies.remove('token')
          Cookies.remove('token', { path: '/' })
          window.localStorage.removeItem('satellizer_token')
          window.location.reload()
        })
      }
      console.error(error.message)
      return Promise.reject(error)
    }
  )

  return endpoint
}

export default createEndpoint
