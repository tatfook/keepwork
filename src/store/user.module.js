import Vue from 'vue'
import _ from 'lodash'
import cookie from 'cookie'
import { keepwork } from '@/api'
import { gitTree2NestedArray } from '@/lib/utils'

const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const GET_PROFILE_SUCCESS = 'GET_PROFILE_SUCCESS'
const GET_ALL_WEBSITE_SUCCESS = 'GET_ALL_WEBSITE_SUCCESS'
const GET_SITE_DATASOURCE_SUCCESS = 'GET_SITE_DATASOURCE_SUCCESS'

const state = () => ({
  info: {},
  profile: {},
  website: {},
  siteDataSource: {}
})

const getters = {
  info: state => state.info,
  token: state => _.get(state, ['info', 'token']),
  username: state => _.get(state, 'profile.username'),

  defaultSiteDataSource: state => _.get(state, 'profile.defaultSiteDataSource'),
  defaultSiteProjectId: (state, getters) => _.get(getters.defaultSiteDataSource, 'projectId'),
  gitlabConfig: (state, getters) => ({
    url: _.get(getters.defaultSiteDataSource, 'rawBaseUrl'),
    token: _.get(getters.defaultSiteDataSource, 'dataSourceToken')
  }),
  websitesMap: (state, getters) => {
    return _.get(state, ['website', getters.username])
  },
  siteDataSourcesMap: (state, getters) => {
    return _.get(state, ['siteDataSource', getters.username])
  },

  personalSiteList: (state, getters, rootState, rootGetters) => {
    let { username, websitesMap, siteDataSourcesMap } = getters
    let { 'gitlab/repositoryTrees': repositoryTrees } = rootGetters
    let websiteNames = _.keys(websitesMap)

    return websiteNames.map(name => {
      let projectId = _.get(siteDataSourcesMap, [name, 'projectId'], getters.defaultSiteProjectId)
      let path = `${username}/${name}`
      let files = _.get(repositoryTrees, [projectId, path], []).map(item => ({...item, path: item.path.substr(path.length + 1)}))
      let children = gitTree2NestedArray(files)
      return {
        ...websitesMap[name],
        projectId,
        children
      }
    })
  }
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
    let { commit, getters: {username} } = context
    return username ? Promise.resolve() : keepwork.user.getProfile(null, getAuthRequestConfig(context)).then(profile => {
      commit(GET_PROFILE_SUCCESS, profile)
    })
  },
  getAllPersonalSite({ dispatch, getters }) {
    let { personalSiteList } = getters
    return personalSiteList.length ? Promise.resolve() : dispatch('getProfile').then(() => {
      let payload = {username: getters.username}
      return Promise.all([
        dispatch('getAllWebsite', payload),
        dispatch('getAllSiteDataSource', payload)
      ])
    })
  },
  getAllWebsite(context, payload) {
    let { commit } = context
    let { username } = payload
    return keepwork.website.getAllByUsername(payload, getAuthRequestConfig(context)).then(list => {
      commit(GET_ALL_WEBSITE_SUCCESS, {username, list})
    })
  },
  getAllSiteDataSource(context, payload) {
    let { commit } = context
    let { username } = payload
    return keepwork.siteDataSource.getByUsername(payload, getAuthRequestConfig(context)).then(list => {
      commit(GET_SITE_DATASOURCE_SUCCESS, {username, list})
    })
  }
}

const mutations = {
  [LOGIN_SUCCESS](state, payload) {
    Vue.set(state, 'info', payload)
  },
  [GET_PROFILE_SUCCESS](state, payload) {
    Vue.set(state, 'profile', payload)
  },
  [GET_ALL_WEBSITE_SUCCESS](state, {username, list}) {
    Vue.set(state, 'website', {
      ...state.website,
      [username]: _.keyBy(list, 'name')
    })
  },
  [GET_SITE_DATASOURCE_SUCCESS](state, {username, list}) {
    Vue.set(state, 'siteDataSource', {
      ...state.siteDataSource,
      [username]: _.keyBy(list, 'sitename')
    })
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
