import { keepwork } from '@/api'
import { props } from './mutations'
import { getFileFullPathByPath } from '@/lib/utils/gitlab'

const {
  LOGIN_SUCCESS,
  GET_PROFILE_SUCCESS,
  GET_ALL_WEBSITE_SUCCESS,
  GET_SITE_DATASOURCE_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  GET_COMMENTS_BY_PAGE_URL_SUCCESS,
  GET_SITE_DETAIL_INFO_SUCCESS
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
    let { commit, getters: { username, authRequestConfig, token } } = context
    if (username) return Promise.resolve()

    let profile = await keepwork.user.getProfile(null, authRequestConfig)
      .catch(e => {
        alert('尚未登陆，请登陆后访问！')
        location.href = '/wiki/login'
      })

    commit(GET_PROFILE_SUCCESS, {...profile, token})
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
  },
  async getWebsiteDetailInfoByPath(context, { path }) {
    let { commit, getters: { getSiteDetailInfoByPath } } = context
    if (getSiteDetailInfoByPath(path)) return

    let [username, sitename] = path.split('/').filter(x => x)
    let detailInfo = await keepwork.website.getDetailInfo({username, sitename})

    commit(GET_SITE_DETAIL_INFO_SUCCESS, {username, sitename, detailInfo})
  },
  async createComment(context, { url: path, content }) {
    let { dispatch, commit, getters: { authRequestConfig }, rootGetters } = context
    let fullPath = getFileFullPathByPath(path)
    let { _id: websiteId, userId } = rootGetters['user/getPersonalSiteInfoByPath'](path)

    let payload = {websiteId, userId, url: fullPath, content}
    let { commentList } = await keepwork.websiteComment.create(payload, authRequestConfig)

    commit(CREATE_COMMENT_SUCCESS, { url: fullPath, commentList })
    await dispatch('getCommentsByPageUrl', {url: fullPath})
  },
  async createCommentForActivePage(context, { content }) {
    let { dispatch, rootGetters: { activePage } } = context
    await dispatch('createComment', {url: activePage, content})
  },
  async deleteCommentById(context, { _id }) {
    let { dispatch, commit, getters: { authRequestConfig } } = context
    await keepwork.websiteComment.deleteById({_id}, authRequestConfig)

    commit(DELETE_COMMENT_SUCCESS, { _id })
    await dispatch('getActivePageComments')
  },
  async getCommentsByPageUrl(context, { url: path }) {
    let { commit, getters: { authRequestConfig } } = context
    let fullPath = getFileFullPathByPath(path)

    let { commentList } = await keepwork.websiteComment.getByPageUrl({url: fullPath}, authRequestConfig)

    commit(GET_COMMENTS_BY_PAGE_URL_SUCCESS, {url: fullPath, commentList})
  },
  async getActivePageComments(context) {
    let { dispatch, rootGetters: { activePage } } = context
    await dispatch('getCommentsByPageUrl', {url: activePage})
  }
}

export default actions
