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
  GET_SITE_DETAIL_INFO_SUCCESS,
  GET_CONTRIBUTED_WEBSITE_SUCCESS,
  UPSERT_WEBSITE_SUCCESS
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
    let { commit, dispatch, getters: { isLogined, authRequestConfig, token } } = context
    if (isLogined) return

    let profile = await keepwork.user.getProfile(null, authRequestConfig)
      .catch(async e => {
        alert('尚未登陆，请登陆后访问！')

        // login for localhost test
        if (location.hostname === 'localhost') {
          let payload = {
            username: prompt('username: '),
            password: prompt('password: ')
          }
          await dispatch('login', payload)
          await dispatch('getProfile')
          return
        }

        location.href = '/wiki/login'
      })

    commit(GET_PROFILE_SUCCESS, {...profile, token})
  },
  async getAllPersonalAndContributedSite({ dispatch, getters }) {
    let { personalSiteList } = getters
    if (personalSiteList.length) return

    await dispatch('getProfile')

    return Promise.all([
      dispatch('getAllWebsite'),
      dispatch('getAllContributedWebsite'),
      dispatch('getAllSiteDataSource')
    ])
  },
  async createWebsite(context, { name }) {
    let { dispatch, getters: { username, authRequestConfig } } = context

    // check if the site already exists
    let siteWithTheSameName = await keepwork.website.getByName({username, sitename: name}, authRequestConfig)
    if (siteWithTheSameName) throw new Error(`Website ${name} already exists!`)

    await dispatch('upsertWebsite', { name })
    await dispatch('getAllWebsite')
    await dispatch('getAllSiteDataSource')
    await dispatch('gitlab/createFile', { path: `${username}/${name}/index.md` }, { root: true })
  },
  async upsertWebsite(context, { name }) {
    let { commit, getters: { username, userId, authRequestConfig } } = context
    let necessaryPayloadInfo = {
      name,
      domain: name,
      visibility: 'public',
      userId,
      username,
      defaultDataSourceName: '内置gitlab'
    }
    // actually, the info below is not necessary for current usage
    // we keep it to prevent any surprise with old version keepwork
    let unnecessaryPayloadInfo = {
      categoryName: '个 人',
      type: 'personal',
      templateName: '空模板',
      styleName: '默认样式',
      logoUrl: 'http://keepwork.com/wiki/assets/imgs/wiki_blank_template.png'
    }

    let site = await keepwork.website.upsert({...necessaryPayloadInfo, ...unnecessaryPayloadInfo}, authRequestConfig)
    commit(UPSERT_WEBSITE_SUCCESS, {username, site})
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
  async getAllContributedWebsite(context) {
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig } = getters
    let list = await keepwork.siteUser.getSiteListByMemberName({memberName: username}, authRequestConfig)

    commit(GET_CONTRIBUTED_WEBSITE_SUCCESS, {username, list})
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
    // todo fix createComment
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
