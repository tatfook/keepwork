import Vue from 'vue'
import _ from 'lodash'
import cookie from 'cookie'
import { keepwork } from '@/api'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'

const state = () => ({
  info: {},
  profile: {}
})

const getters = {
  info: state => state.info,
  token: state => _.get(state, ['info', 'token']),
  gitlabConfig: state => ({
    url: _.get(state, 'profile.defaultSiteDataSource.rawBaseUrl'),
    token: _.get(state, 'profile.defaultSiteDataSource.dataSourceToken')
  })
}

// maybe there's better way to set Authorization headers
const getTokenInCookie = () => _.get(cookie.parse(document.cookie), 'token')
const getAuthRequestConfig = ({ getters }) => {
  let token = getters['token'] || getTokenInCookie()
  return token
    ? {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
    : {}
}

const actions = {
  login({ commit }, payload) {
    return keepwork.user.login(payload).then(info => {
      commit(LOGIN_SUCCESS, info)
    })
  },
  getProfile(context, payload) {
    let { commit } = context
    return keepwork.user.getProfile(null, getAuthRequestConfig(context)).then(profile => {
      commit(GET_PROFILE_SUCCESS, profile)
    })
  }
}

const mutations = {
  [LOGIN_SUCCESS](state, payload) {
    Vue.set(state, 'info', payload)
  },
  [GET_PROFILE_SUCCESS](state, payload) {
    Vue.set(state, 'profile', payload)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
