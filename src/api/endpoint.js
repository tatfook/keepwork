'use strict'
import _ from 'lodash'
import axios from 'axios'

const DEFAULT_CONFIG = {
  baseURL: process.env.KEEPWORK_API_PREFIX,
  timeout: 6000,
  headers: {
    'Content-Type': 'application/json; charset=UTF-8'
  }
}

const createEndpoint = config => {
  let endpoint = axios.create(_.merge(DEFAULT_CONFIG, config))
  endpoint.interceptors.request.use(
    config => {
      return config
    },
    error => {
      return Promise.reject(error)
    }
  )

  endpoint.interceptors.response.use(
    response => {
      return response
    },
    error => {
      return Promise.resolve(error.response)
    }
  )

  return endpoint
}

export default {
  createEndpoint
}
