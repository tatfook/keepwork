import _ from 'lodash'
import axios from 'axios'
import Cookies from 'js-cookie'
import axiosRetry from 'axios-retry'
import { Message } from 'element-ui'

axiosRetry(axios, { retries: 3 })

const DEFAULT_CONFIG = {
  baseURL: process.env.KEEPWORK_API_PREFIX,
  timeout: 20000,
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json; charset=UTF-8'
  }
}

const _instance = axios.create(DEFAULT_CONFIG)
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
      const CODES = [401]
      if (CODES.some(code => code === _.get(error, 'response.status', '')) && Cookies.get('token')) {
        _instance.defaults.headers.common['Authorization'] = `Bearer ${Cookies.get('token')}`
        _instance.get('/users/profile').catch(e => {
          if (CODES.some(code => code === _.get(e, 'response.status', ''))) {
            if (['release', 'stage'].some(item => process.env.KEEPWORK_API_PREFIX.includes(item))) {
              Message({
                type: 'error',
                message: 'token失效，将于3秒后刷新页面'
              })
              setTimeout(() => {
                Cookies.remove('token')
                Cookies.remove('token', { path: '/' })
                window.localStorage.removeItem('satellizer_token')
                window.location.reload()
              }, 1000 * 3)
            } else {
              if (window.navigator.userAgent.indexOf('Edge') > -1) {
                Cookies.set('token', '')
              }
              Cookies.remove('token')
              Cookies.remove('token', { path: '/' })
              window.localStorage.removeItem('satellizer_token')
              window.location.reload()
            }
          }
        })
      }
      console.error(error.message)
      return Promise.reject(error)
    }
  )

  return endpoint
}

export default createEndpoint
