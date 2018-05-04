import _ from 'lodash'
import { keepwork } from '@/api'
import { props } from './mutations'
import { getFileFullPathByPath, webTemplateProject } from '@/lib/utils/gitlab'
import { showRawForGuest as gitlabShowRawForGuest, newGitlabAPI } from '@/api/gitlab'

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
  GET_WEB_TEMPLATE_FILELIST_SUCCESS,
  GET_WEB_TEMPLATE_FILE_SUCCESS,
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
  getProfile: (() => {
    let getProfilePromise
    let clearGetProfilePromise = () => (getProfilePromise = null)

    return async (context) => {
      let { commit, dispatch, getters: { isLogined, authRequestConfig, token } } = context
      if (isLogined) return

      getProfilePromise = getProfilePromise || new Promise(resolve => {
        keepwork.user.getProfile(null, authRequestConfig).then(profile => {
          commit(GET_PROFILE_SUCCESS, {...profile, token})
          resolve()
        }).catch(async e => {
          alert('尚未登陆，请登陆后访问！')
          // login for localhost test
          if (location.hostname === 'localhost') {
            let payload = {
              username: prompt('username: '),
              password: prompt('password: ')
            }
            await dispatch('login', payload)

            clearGetProfilePromise()
            await dispatch('getProfile')
            return resolve()
          }
          location.href = '/wiki/login'
          setTimeout(resolve, 10 * 1000)
        })
      }).then(clearGetProfilePromise)

      await getProfilePromise
    }
  })(),
  async getAllPersonalAndContributedSite({ dispatch }, payload) {
    let { useCache = true } = payload || {}
    await dispatch('getProfile')

    return Promise.all([
      dispatch('getAllWebsite', { useCache }),
      dispatch('getAllContributedWebsite', { useCache }),
      dispatch('getAllSiteDataSource', { useCache })
    ])
  },
  async createWebsite({ dispatch }, payload) {
    // check if the site already exists
    // don't need any more, we've got the function in NewWebsiteDialog.vue
    // let { name } = payload
    // let siteWithTheSameName = await keepwork.website.getByName({username, sitename: name}, authRequestConfig)
    // if (siteWithTheSameName) throw new Error(`Website ${name} already exists!`)

    await dispatch('upsertWebsite', payload)
    await dispatch('getAllWebsite', { useCache: false })
    await dispatch('getAllSiteDataSource', { useCache: false })
    await dispatch('initWebsite', payload)
  },
  async initWebsite({ dispatch, getters }, { name }) {
    let { username, getWebTemplate, getPersonalSiteInfoByPath } = getters
    let { type: categoryName, templateName } = getPersonalSiteInfoByPath(`${username}/${name}`)

    await dispatch('getWebTemplateConfig')
    let webTemplate = getWebTemplate({ categoryName, templateName })
    await dispatch('getWebTemplateFiles', webTemplate)
    let { fileList } = webTemplate

    // copy all file in template.folder
    for (let {path, content} of fileList) {
      let filename = path.split('/').slice(2).join('/')
      await dispatch('gitlab/createFile', { path: `${username}/${name}/${filename}`, content, refreshRepositoryTree: false }, { root: true })
    }

    // refresh repositoryTree
    await dispatch('gitlab/getRepositoryTree', {path: `${username}/${name}`, useCache: false}, { root: true })
  },
  async getWebTemplateConfig({ commit, dispatch, getters: { webTemplateConfig, getWebTemplate } }) {
    if (!_.isEmpty(webTemplateConfig)) return
    let { rawBaseUrl, dataSourceUsername, projectName, configFullPath } = webTemplateProject
    let config = await gitlabShowRawForGuest(rawBaseUrl, dataSourceUsername, projectName, configFullPath)
    commit(GET_WEB_TEMPLATE_CONFIG_SUCCESS, {config})
  },
  async getWebTemplateFiles({ commit, dispatch }, webTemplate) {
    await dispatch('getWebTemplateFileList', webTemplate)
    let { fileList } = webTemplate
    let { rawBaseUrl, dataSourceUsername, projectName } = webTemplateProject
    await Promise.all(fileList.map(async file => {
      let { path, content } = file
      if (!_.isEmpty(content)) return
      content = await gitlabShowRawForGuest(rawBaseUrl, dataSourceUsername, projectName, path)
      content = _.isString(content) ? content : JSON.stringify(content)
      commit(GET_WEB_TEMPLATE_FILE_SUCCESS, {file, content})
    }))
  },
  async getWebTemplateFileList({ commit }, webTemplate) {
    let { folder, fileList } = webTemplate
    if (!_.isEmpty(fileList)) return
    let { rawBaseUrl, projectId } = webTemplateProject
    let gitlabForGuest = newGitlabAPI({url: rawBaseUrl, token: ' '})
    fileList = await gitlabForGuest.projects.repository.tree(projectId, {path: `templates/${folder}`, recursive: true})
    fileList = fileList.filter(file => file.type === 'blob')
    commit(GET_WEB_TEMPLATE_FILELIST_SUCCESS, { webTemplate, fileList })
  },
  async upsertWebsite(context, { name, websiteSetting: {
    categoryName = 'Basic',
    type = 'Basic', // level1 classify get templates, seems useless in new templates solution
    templateName = 'Basic', // level2 templates .name
    styleName = '默认样式', // level3 template.styles .name, seems useless in new templates solution
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
  async getAllWebsite(context, { useCache = false } = {}) {
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig, personalSiteList } = getters
    if (useCache && personalSiteList.length) return

    let list = await keepwork.website.getAllByUsername({username}, authRequestConfig)
    commit(GET_ALL_WEBSITE_SUCCESS, {username, list})
  },
  async getAllSiteDataSource(context, { useCache = false }) {
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig, siteDataSourcesMap } = getters
    if (useCache && !_.isEmpty(siteDataSourcesMap)) return

    let list = await keepwork.siteDataSource.getByUsername({username}, authRequestConfig)
    commit(GET_SITE_DATASOURCE_SUCCESS, {username, list})
  },
  async getAllContributedWebsite(context, { useCache = false }) {
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig, contributedSiteList } = getters
    if (useCache && !_.isEmpty(contributedSiteList)) return

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
    let { dispatch, commit, getters, rootGetters } = context
    let fullPath = getFileFullPathByPath(path)

    await dispatch('getProfile')
    let { authRequestConfig, userId } = getters
    await dispatch('getWebsiteDetailInfoByPath', { path })
    let { siteinfo: { _id: websiteId } } = rootGetters['user/getSiteDetailInfoByPath'](path)

    let payload = {websiteId, userId, url: fullPath, content}
    let { commentList } = await keepwork.websiteComment.create(payload, authRequestConfig)

    commit(CREATE_COMMENT_SUCCESS, { url: fullPath, commentList })
    await dispatch('getCommentsByPageUrl', {url: fullPath})
  },
  async createCommentForActivePage(context, { content }) {
    let { dispatch, rootGetters: { activePageUrl } } = context
    await dispatch('createComment', {url: activePageUrl, content})
  },
  async deleteCommentById(context, { _id }) {
    let { dispatch, commit, getters: { authRequestConfig } } = context
    await keepwork.websiteComment.deleteById({_id}, authRequestConfig)

    commit(DELETE_COMMENT_SUCCESS, { _id })
    await dispatch('getActivePageComments')
  },
  async getCommentsByPageUrl({ commit }, { url: path }) {
    let fullPath = getFileFullPathByPath(path)

    let { commentList } = await keepwork.websiteComment.getByPageUrl({url: fullPath})

    commit(GET_COMMENTS_BY_PAGE_URL_SUCCESS, {url: fullPath, commentList})
  },
  async getActivePageComments(context) {
    let { dispatch, rootGetters: { activePageUrl } } = context
    await dispatch('getCommentsByPageUrl', {url: activePageUrl})
  },
  async starPages(context, { url }) {
    let { commit, dispatch, getters } = context
    await dispatch('getProfile')
    let { username, authRequestConfig } = getters
    let pageStarResult = await keepwork.pages.star({url, visitor: username}, authRequestConfig)
    commit(SET_PAGE_STAR_DETAIL, pageStarResult)
  },
  async initPageDetail(context, { url, visitor }) {
    let { commit } = context
    let pageDetail = await keepwork.pages.getDetail({url, visitor})
    commit(SET_PAGE_STAR_DETAIL, pageDetail)
  }
}

export default actions
