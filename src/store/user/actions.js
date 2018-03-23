import { keepwork } from '@/api'
import { props } from './mutations'

const {
  LOGIN_SUCCESS,
  GET_PROFILE_SUCCESS,
  GET_ALL_WEBSITE_SUCCESS,
  GET_SITE_DATASOURCE_SUCCESS
} = props

const actions = {
  async login({ commit }, payload) {
    let info = await keepwork.user.login(payload)
    commit(LOGIN_SUCCESS, info)
  },
  /*doc
    getProfile
    can be called without username,
    only uses cookie info;
    dispatch this action first, in any action which depends on username.
  */
  async getProfile(context) {
    let { commit, getters: {username, authRequestConfig} } = context
    if (username) return Promise.resolve()

    let profile = await keepwork.user.getProfile(null, authRequestConfig)
    commit(GET_PROFILE_SUCCESS, profile)
  },
  async getAllPersonalSite({ dispatch, getters }) {
    let { personalSiteList } = getters
    if (personalSiteList.length) return Promise.resolve()

    await dispatch('getProfile')

    return Promise.all([
      dispatch('getAllWebsite'),
      dispatch('getAllSiteDataSource')
    ])
  },
  async getAllWebsite(context) {
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig } = getters
    let list = await keepwork.website.getAllByUsername({username}, authRequestConfig)

    commit(GET_ALL_WEBSITE_SUCCESS, {username, list})
  },
  async getAllSiteDataSource(context) {
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig } = getters
    let list = await keepwork.siteDataSource.getByUsername({username}, authRequestConfig)

    commit(GET_SITE_DATASOURCE_SUCCESS, {username, list})
  }
}

export default actions
