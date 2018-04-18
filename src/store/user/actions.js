import _ from 'lodash'
import { keepwork } from '@/api'
import { props } from './mutations'
import { getFileFullPathByPath, webTemplateProject } from '@/lib/utils/gitlab'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'

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
  UPSERT_WEBSITE_SUCCESS,
  GET_WEB_TEMPLATE_CONFIG_SUCCESS,
  SET_PAGE_STAR_DETAIL
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
  async createWebsite({ dispatch }, payload) {
    // check if the site already exists
    // don't need any more, we've got the function in NewWebsiteDialog.vue
    // let { name } = payload
    // let siteWithTheSameName = await keepwork.website.getByName({username, sitename: name}, authRequestConfig)
    // if (siteWithTheSameName) throw new Error(`Website ${name} already exists!`)

    await dispatch('upsertWebsite', payload)
    await dispatch('getAllWebsite')
    await dispatch('getAllSiteDataSource')
    await dispatch('initWebsite', payload)
  },
  async initWebsite({ dispatch, getters }, { name }) {
    let { username, getWebTemplateStyle, getPersonalSiteInfoByPath } = getters
    let { type: classify, templateName, styleName } = getPersonalSiteInfoByPath(`${username}/${name}`)

    await dispatch('getWebTemplateConfig')
    let { contents } = getWebTemplateStyle({ classify, templateName, styleName })

    // copy all file in template.style.contents
    for (let {pagepath, contentUrl} of contents) {
      let { rawBaseUrl, dataSourceUsername, projectName } = webTemplateProject
      let contentUrlFullPath = getFileFullPathByPath(contentUrl)
      let content = await gitlabShowRawForGuest(rawBaseUrl, dataSourceUsername, projectName, contentUrlFullPath)
      await dispatch('gitlab/createFile', { path: `${username}/${name}/${pagepath}.md`, content, refreshRepositoryTree: false }, { root: true })
    }

    // refresh repositoryTree
    await dispatch('gitlab/getRepositoryTree', {path: `${username}/${name}`, ignoreCache: true}, { root: true })
  },
  async getWebTemplateConfig({ commit, getters: { webTemplateConfig } }) {
    if (!_.isEmpty(webTemplateConfig)) return
    let { rawBaseUrl, dataSourceUsername, projectName, configFullPath } = webTemplateProject
    let configMarkDown = await gitlabShowRawForGuest(rawBaseUrl, dataSourceUsername, projectName, configFullPath)
    let configStringified = configMarkDown.replace(/^[\s`]*|[\s`]*$/g, '')
    let config = JSON.parse(configStringified)
    commit(GET_WEB_TEMPLATE_CONFIG_SUCCESS, {config})
  },
  async upsertWebsite(context, { name, websiteSetting: {
    categoryName = '个 人',
    type = 'personal', // level1 classify get templates
    templateName = '空模板', // level2 templates .name
    styleName = '默认样式', // level3 template.styles .name
    logoUrl = 'http://keepwork.com/wiki/assets/imgs/wiki_blank_template.png'
  } }) {
    let { commit, getters: { username, userId, authRequestConfig } } = context
    let websiteSetting = { categoryName, type, templateName, styleName, logoUrl }
    let upsertPayload = {
      name,
      domain: name,
      visibility: 'public',
      userId,
      username,
      defaultDataSourceName: '内置gitlab',
      ...websiteSetting
    }
    let site = await keepwork.website.upsert(upsertPayload, authRequestConfig)
    commit(UPSERT_WEBSITE_SUCCESS, {username, site})
  },
  async getAllWebsite(context, { ignoreCache = true } = {}) {
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig, personalSiteList } = getters
    if (!ignoreCache && personalSiteList.length) return

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
  },
  async starPages(context, { url, visitor }) {
    let { commit, getters: { authRequestConfig } } = context
    let pageStarResult = await keepwork.pages.star({url, visitor}, authRequestConfig)
    commit(SET_PAGE_STAR_DETAIL, pageStarResult)
  },
  async initPageDetail(context, { url, visitor }) {
    let { commit } = context
    let pageDetail = await keepwork.pages.getDetail({url, visitor})
    commit(SET_PAGE_STAR_DETAIL, pageDetail)
  }
}

export default actions
