import _ from 'lodash'
import { keepwork, GitAPI, skyDrive, sensitiveWord } from '@/api'
import { props } from './mutations'
import { getFileFullPathByPath, getFileSitePathByPath, webTemplateProject } from '@/lib/utils/gitlab'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import LayoutHelper from '@/lib/mod/layout'
import ThemeHelper from '@/lib/theme'
import Cookies from 'js-cookie'
import contactContent from '@/assets/source/contact.md'
import profileContent from '@/assets/source/profile.md'
import siteContent from '@/assets/source/site.md'

const {
  LOGIN_SUCCESS,
  LOGOUT,
  GET_PROFILE_SUCCESS,
  SET_REAL_AUTH_PHONE_NUM,
  GET_ALL_WEBSITE_SUCCESS,
  GET_SITE_DATASOURCE_SUCCESS,
  CREATE_COMMENT_SUCCESS,
  DELETE_COMMENT_SUCCESS,
  GET_COMMENTS_BY_PAGE_URL_SUCCESS,
  GET_SITE_DETAIL_INFO_SUCCESS,
  GET_CONTRIBUTED_WEBSITE_SUCCESS,
  UPSERT_WEBSITE_SUCCESS,
  GET_WEB_TEMPLATE_CONFIG_SUCCESS,
  GET_WEBPAGE_TEMPLATE_CONFIG_SUCCESS,
  GET_WEBPAGE_TEMPLATE_CONTENT_SUCCESS,
  GET_WEB_TEMPLATE_FILELIST_SUCCESS,
  GET_WEB_TEMPLATE_FILE_SUCCESS,
  SET_PAGE_STAR_DETAIL,
  GET_SITE_LAYOUT_CONFIG_SUCCESS,
  SAVE_SITE_LAYOUT_CONFIG_SUCCESS,
  UPDATE_SITE_MSG_SUCCESS,
  GET_FROM_SKY_DRIVE_SUCCESS,
  GET_USER_DETAIL_SUCCESS,
  GET_SITE_THEME_CONFIG_SUCCESS,
  SAVE_SITE_THEME_CONFIG_SUCCESS,
  USE_FILE_IN_SITE_SUCCESS,
  GET_USER_THREE_SERVICES_SUCCESS,
  SET_AUTH_CODE_INFO
} = props

const USER_PROFILE_PAGES_CONTENTS = [
  {
    fileName: 'profile',
    content: profileContent
  },
  {
    fileName: 'site',
    content: siteContent
  },
  {
    fileName: 'contact',
    content: contactContent
  }
]

const actions = {
  async login({ commit, dispatch }, payload) {
    let info = await keepwork.user.login(payload, null, true)
    if (info) {
      Cookies.set('token', info.token)
      window.localStorage.setItem('satellizer_token', info.token)
      commit(LOGIN_SUCCESS, info)
      await dispatch('lesson/getUserDetail', null, { root: true })
    }
    return info
  },
  thirdLogin({ commit }, { userinfo, token }) {
    Cookies.set('token', token)
    window.localStorage.setItem('satellizer_token', token)
    commit(LOGIN_SUCCESS, { userinfo, token })
  },
  async logout({ commit, dispatch }) {
    commit(LOGOUT)
    await dispatch('lesson/logout', null, { root: true })
    Cookies.remove('token')
    Cookies.remove('token', { path: '/' })
    window.localStorage.removeItem('satellizer_token')
    window.location.reload()
  },
  async createUserProfilePageToBack(context, { username }) {
    let { getters: { authRequestConfig } } = context
    let profilePageUrl = `/${username}`
    await keepwork.pages.insert({ url: profilePageUrl }, authRequestConfig)
  },
  async createUserProfilePagesToGit(context, { defaultSiteDataSource }) {
    let { dispatch } = context
    let { username } = defaultSiteDataSource
    for (let index = 0; index < USER_PROFILE_PAGES_CONTENTS.length; index++) {
      let { content, fileName } = USER_PROFILE_PAGES_CONTENTS[index]
      let filePath = encodeURI(`${username}_datas/${fileName}.md`)
      await dispatch('gitlab/createFile', { path: filePath, content, refreshRepositoryTree: false }, { root: true })
    }
  },
  async register({ dispatch }, payload) {
    let registerInfo = await keepwork.user.register(payload, null, true)
    let { username, password } = payload
    console.log('registerInfo', registerInfo)
    if (registerInfo) {
      await dispatch('login', { username, password })
      // let userinfo = _.get(registerInfo, 'data.userinfo')
      // let { defaultSiteDataSource } = userinfo
      await dispatch('createUserProfilePageToBack', { username })
      // await dispatch('createUserProfilePagesToGit', { defaultSiteDataSource })
    }
    return registerInfo
  },
  async thirdRegister({ commit }, payload) {
    let thirdRegisterInfo = await keepwork.user.bindThreeService(payload, null, true)
    return thirdRegisterInfo
  },
  async getProfile(context, { forceLogin = true, useCache = true } = {}) {
    let { commit, getters: { token } } = context
    if (useCache) return
    const profile = await keepwork.user.getProfile()
    await commit(GET_PROFILE_SUCCESS, { ...profile, token })
  },
  async getUserDetailByUsername(context, { username }) {
    console.warn('getUserDetailByUsername---->')
    let { commit, getters: { usersDetail } } = context
    let userDetail = usersDetail && usersDetail[username]
    if (userDetail) {
      return
    }
    userDetail = await keepwork.user.getDetailByName({ username })
    let userId = _.get(userDetail, 'id')
    commit(GET_USER_DETAIL_SUCCESS, { userId, username, userDetail })
  },
  async getUserDetailByUserId(context, { userId }) {
    let { commit, getters: { usersDetail } } = context
    let userDetail = usersDetail && usersDetail[userId]
    if (userDetail) {
      return
    }
    userDetail = await keepwork.user.getDetailById({ userId })
    let { username } = userDetail
    commit(GET_USER_DETAIL_SUCCESS, { userId, username, userDetail })
  },
  async updateUserInfo(context, userInfo) {
    let { commit, getters: { profile } } = context
    let newUserInfo = await keepwork.user.update(userInfo)
    commit(GET_PROFILE_SUCCESS, { ...profile, ...newUserInfo })
  },
  async verifyCellphoneOne(context, { bind, setRealNameInfo, cellphone }) {
    let { commit } = context
    let verifyInfoOne = await keepwork.user.verifyCellphoneOne({ bind, setRealNameInfo, cellphone })
    commit(SET_REAL_AUTH_PHONE_NUM, verifyInfoOne)
    return verifyInfoOne
  },
  async verifyCellphoneTwo(context, { setRealNameInfo, cellphone, smsCode, smsId, bind }) {
    let { dispatch, commit, getters: { sendCodeInfo } } = context
    smsId = smsId || (sendCodeInfo.data && sendCodeInfo.data.smsId)
    let verifyInfoTwo = await keepwork.user.verifyCellphoneTwo({ setRealNameInfo, smsCode, smsId, bind })
    await dispatch('getProfile', { useCache: false })
    commit(SET_AUTH_CODE_INFO, verifyInfoTwo)
    return verifyInfoTwo
  },
  async getAllPersonalPageList({ dispatch, getters }, payload) {
    let { useCache = true } = payload || {}
    await dispatch('getAllPersonalWebsite', { useCache })
    let { personalSitePathMap } = getters
    await Promise.all(_.keys(personalSitePathMap).map(async (sitepath) => {
      await dispatch('gitlab/getRepositoryTree', { path: sitepath, useCache }, { root: true })
    })).catch(e => console.error(e))
  },
  async getAllPersonalAndContributedSite({ dispatch }, payload) {
    let { useCache = true } = payload || {}

    return Promise.all([
      dispatch('getAllPersonalWebsite', { useCache }),
      dispatch('getAllContributedWebsite', { useCache })
    ])
  },
  async getAllPersonalWebsite({ dispatch }, payload) {
    let { useCache = false } = payload || {}

    return dispatch('getAllWebsite', { useCache })
    // return Promise.all([
    //   dispatch('getAllWebsite', { useCache }),
    //   dispatch('getAllSiteDataSource', { useCache })
    // ])
  },
  async createWebsite({ dispatch }, payload) {
    await dispatch('upsertWebsite', payload)
    await dispatch('getAllWebsite', { useCache: false })
    // await dispatch('getAllSiteDataSource', { useCache: false })
    console.warn('payload', payload)
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
    for (let { path, content } of fileList) {
      let filename = path.split('/').slice(2).join('/')
      await dispatch('gitlab/createFile', { path: `${username}/${name}/${filename}`, content, refreshRepositoryTree: false }, { root: true })
    }

    // refresh repositoryTree
    // await dispatch('gitlab/getRepositoryTree', { path: `${username}/${name}`, useCache: false }, { root: true })
  },
  // async initWebsite({ dispatch, getters }, { name }) {
  //   let { username, getWebTemplate, getPersonalSiteInfoByPath } = getters
  //   let { type: categoryName, templateName } = getPersonalSiteInfoByPath(`${username}/${name}`)

  //   await dispatch('getWebTemplateConfig')
  //   let webTemplate = getWebTemplate({ categoryName, templateName })
  //   await dispatch('getWebTemplateFiles', webTemplate)
  //   let { fileList } = webTemplate

  //   // copy all file in template.folder
  //   for (let { path, content } of fileList) {
  //     let filename = path.split('/').slice(2).join('/')
  //     await dispatch('gitlab/createFile', { path: `${username}/${name}/${filename}`, content, refreshRepositoryTree: false }, { root: true })
  //   }

  //   // refresh repositoryTree
  //   await dispatch('gitlab/getRepositoryTree', { path: `${username}/${name}`, useCache: false }, { root: true })
  // },
  async getWebTemplateConfig({ commit, dispatch, getters: { webTemplateConfig, getWebTemplate } }) {
    if (!_.isEmpty(webTemplateConfig)) return
    let { rawBaseUrl, dataSourceUsername, projectName, configFullPath } = webTemplateProject
    let config = await gitlabShowRawForGuest(rawBaseUrl, dataSourceUsername, projectName, configFullPath)
    commit(GET_WEB_TEMPLATE_CONFIG_SUCCESS, { config })
  },
  async getWebPageTemplateConfig({ commit, dispatch, getters: { webPageTemplateConfig, getWebTemplate } }) {
    if (!_.isEmpty(webPageTemplateConfig)) return
    let { rawBaseUrl, dataSourceUsername, projectName, pageTemplateConfigFullPath } = webTemplateProject
    let config = await gitlabShowRawForGuest(rawBaseUrl, dataSourceUsername, projectName, pageTemplateConfigFullPath)
    commit(GET_WEBPAGE_TEMPLATE_CONFIG_SUCCESS, { config })
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
      commit(GET_WEB_TEMPLATE_FILE_SUCCESS, { file, content })
    }))
  },
  async getWebTemplateFileList({ commit }, webTemplate) {
    let { folder, fileList } = webTemplate
    if (!_.isEmpty(fileList)) return
    let { rawBaseUrl, projectId } = webTemplateProject
    let gitlabForGuest = new GitAPI({ url: rawBaseUrl + '/api/v4', token: ' ' })
    fileList = await gitlabForGuest.getTree({ projectId, path: `templates/${folder}`, recursive: true })
    fileList = fileList.filter(file => file.type === 'blob')
    commit(GET_WEB_TEMPLATE_FILELIST_SUCCESS, { webTemplate, fileList })
  },
  async upsertWebsite(context, { name, websiteSetting: {
    categoryName = 'Basic',
    type = 'Basic', // level1 classify get templates, seems useless in new templates solution
    templateName = 'Basic', // level2 templates .name
    styleName = '默认样式', // level3 template.styles .name, seems useless in new templates solution
    logoUrl = '//keepwork.com/wiki/assets/imgs/wiki_blank_template.png'
  } }) {
    let { commit, getters: { username, userId } } = context
    let websiteSetting = { categoryName, type, templateName, styleName, logoUrl }
    let upsertPayload = {
      sitename: name,
      visibility: 0,
      extra: {
        websiteSetting
      }
    }
    let site = await keepwork.website.upsert(upsertPayload)
    commit(UPSERT_WEBSITE_SUCCESS, { username, site })
  },
  async getContentOfWebPageTemplate({ dispatch, commit }, { template }) {
    let { content, contentPath } = template
    if (typeof content === 'string') return content

    let { rawBaseUrl, dataSourceUsername, pageTemplateRoot, projectName } = webTemplateProject
    content = await gitlabShowRawForGuest(rawBaseUrl, dataSourceUsername, projectName, `${pageTemplateRoot}/${contentPath}`)
    commit(GET_WEBPAGE_TEMPLATE_CONTENT_SUCCESS, { template, content })

    return content
  },
  async addNewWebPage({ dispatch }, { path, template }) {
    let content = await dispatch('getContentOfWebPageTemplate', { template })
    await dispatch('gitlab/createFile', { path, content }, { root: true })
  },
  async getAllWebsite(context, payload) {
    let { useCache = false } = payload || {}
    let { commit, getters } = context

    let { username, personalSiteList } = getters
    if (useCache && personalSiteList.length) return

    let list = await keepwork.website.getAllSites()
    commit(GET_ALL_WEBSITE_SUCCESS, { username, list })
  },
  async getAllSiteDataSource(context, payload) {
    let { useCache = false } = payload || {}
    let { commit, getters } = context

    let { username, siteDataSourcesMap } = getters
    if (useCache && !_.isEmpty(siteDataSourcesMap)) return

    let list = await keepwork.siteDataSource.getByUsername({ username })
    commit(GET_SITE_DATASOURCE_SUCCESS, { username, list })
  },
  async getAllContributedWebsite(context, payload) {
    let { useCache = false } = payload || {}
    let { commit, getters } = context

    let { username } = getters
    if (useCache) return
    let list = await keepwork.siteUser.getContributeSites()
    // let list = await keepwork.siteUser.getSiteListByMemberName({ memberName: username })
    list = _.values(list).filter(({ siteinfo, siteuser } = {}) => siteinfo && siteuser)

    commit(GET_CONTRIBUTED_WEBSITE_SUCCESS, { username, list })
  },
  async getWebsiteDetailInfoByPath(context, { path }) {
    let { commit, getters: { getSiteDetailInfoByPath, userId } } = context
    if (getSiteDetailInfoByPath(path)) return
    let [username, sitename] = path.split('/').filter(x => x)
    let detailInfo = await keepwork.website.getDetailInfo({ username, sitename })
    detailInfo.site.username = username
    commit(GET_SITE_DETAIL_INFO_SUCCESS, { username, sitename, detailInfo })
  },
  async getSiteLayoutConfig(context, { path, editorMode = true, useCache = true }) {
    let { commit, dispatch, getters: { siteLayoutConfigBySitePath }, rootGetters } = context
    let sitePath = getFileSitePathByPath(path)
    let config = siteLayoutConfigBySitePath(sitePath)
    if (useCache && !_.isEmpty(config)) return

    let layoutFilePath = LayoutHelper.layoutFilePath(sitePath)
    await dispatch('gitlab/readFile', { path: layoutFilePath, editorMode }, { root: true }).catch(e => {
      // ignore the error, for old site without config information
      console.error(e)
    })
    let { 'gitlab/getFileByPath': gitlabGetFileByPath } = rootGetters
    let { content } = gitlabGetFileByPath(layoutFilePath) || {}
    config = _.isString(content) ? JSON.parse(content) : content
    commit(GET_SITE_LAYOUT_CONFIG_SUCCESS, { sitePath, config })
  },
  async saveSiteLayoutConfig(context, { sitePath, layoutConfig, pages }) {
    let { commit, dispatch, getters: { siteLayoutConfigBySitePath } } = context
    let config = siteLayoutConfigBySitePath(sitePath)
    let unSaveLayoutConfig = {
      ..._.get(config, 'layoutConfig'),
      ...layoutConfig
    }
    let _pages = _.merge({}, _.get(config, 'pages'), pages)
    unSaveLayoutConfig.layouts = _.filter(unSaveLayoutConfig.layouts, layout => !layout.deleted)
    const allLayoutId = _.map(unSaveLayoutConfig.layouts, layout => layout.id)
    _pages = _.pickBy(_pages, page => allLayoutId.includes(page.layout))
    let unsavedConfig = {
      ...config,
      layoutConfig: unSaveLayoutConfig,
      pages: _pages
    }
    let content = JSON.stringify(unsavedConfig, null, 2)
    let layoutFilePath = LayoutHelper.layoutFilePath(sitePath)
    await dispatch('gitlab/saveFile', { path: layoutFilePath, content }, { root: true })
    commit(SAVE_SITE_LAYOUT_CONFIG_SUCCESS, { sitePath, config: unsavedConfig })
    dispatch('refreshSiteSettings', { sitePath }, { root: true })
  },
  async getSiteThemeConfig(context, { path, editorMode = true, useCache = true }) {
    let { commit, dispatch, rootGetters } = context
    let sitePath = getFileSitePathByPath(path)
    let config = getFileSitePathByPath(sitePath)
    let themeFilePath = ThemeHelper.themeFilePath(sitePath)
    await dispatch('gitlab/readFile', { path: themeFilePath, editorMode }, { root: true })
      .then(async () => {
        let { 'gitlab/getFileByPath': gitlabGetFileByPath } = rootGetters
        let { content } = gitlabGetFileByPath(themeFilePath) || {}
        config = _.isString(content) ? JSON.parse(content) : content
        commit(GET_SITE_THEME_CONFIG_SUCCESS, { sitePath, config })
      })
      .catch(async () => {
        config = ThemeHelper.defaultTheme
        commit(GET_SITE_THEME_CONFIG_SUCCESS, { sitePath, config })
      })
  },
  async saveSiteThemeConfig(context, { sitePath, config }) {
    let { commit, dispatch } = context
    let content = JSON.stringify(config, null, 2)
    let themeFilePath = ThemeHelper.themeFilePath(sitePath)
    await dispatch('gitlab/saveFile', { path: themeFilePath, content }, { root: true })
      .catch(async () => {
        await dispatch('gitlab/createFile', { path: themeFilePath, content, refreshRepositoryTree: false }, { root: true })
      })
    commit(SAVE_SITE_THEME_CONFIG_SUCCESS, { sitePath, config })
    dispatch('refreshSiteSettings', { sitePath }, { root: true })
  },
  async deletePagesConfig(context, { sitePath, pages }) {
    let { commit, dispatch, getters: { siteLayoutConfigBySitePath } } = context
    let config = siteLayoutConfigBySitePath(sitePath)
    config.pages = _.omit(config.pages, pages)
    let unSaveLayoutConfig = {
      ..._.get(config, 'layoutConfig')
    }
    let _pages = _.omit(config.pages, pages)
    let unSavedConfig = {
      ...config,
      layoutConfig: unSaveLayoutConfig,
      pages: _pages
    }
    let content = JSON.stringify(unSavedConfig, null, 2)
    let layoutFilePath = LayoutHelper.layoutFilePath(sitePath)
    await dispatch('gitlab/saveFile', { path: layoutFilePath, content }, { root: true })
    commit(SAVE_SITE_LAYOUT_CONFIG_SUCCESS, { sitePath, config: unSavedConfig })
    dispatch('refreshSiteSettings', { sitePath }, { root: true })
  },
  async renamePageFromConfig(context, { currentFilePath, newFilePath }) {
    let { commit, dispatch, getters: { siteLayoutConfigBySitePath } } = context
    await dispatch('getSiteLayoutConfig', { path: currentFilePath })
    let sitePath = getFileSitePathByPath(currentFilePath)
    let config = siteLayoutConfigBySitePath(sitePath)
    let { pages = null } = config || {}
    if (!pages) return
    let currentPageName = currentFilePath.replace(`${sitePath}/`, '')
    let newPageName = newFilePath.replace(`${sitePath}/`, '')
    if (pages[currentPageName] && pages[currentPageName]['layout']) {
      pages[newPageName] = {}
      pages[newPageName]['layout'] = pages[currentPageName]['layout']
    }
    pages = _.omit(pages, [currentPageName])
    let layoutConfig = _.get(config, 'layoutConfig')
    let unSaveConfig = {
      ...config,
      layoutConfig,
      pages
    }
    let content = JSON.stringify(unSaveConfig, null, 2)
    let layoutFilePath = LayoutHelper.layoutFilePath(sitePath)
    await dispatch('gitlab/saveFile', { path: layoutFilePath, content }, { root: true })
    commit(SAVE_SITE_LAYOUT_CONFIG_SUCCESS, { sitePath, config: unSaveConfig })
    dispatch('refreshSiteSettings', { sitePath }, { root: true })
  },

  async renamePagesFromConfig(context, { currentFolderPath, newFolderPath, childrenFiles }) {
    let { commit, dispatch, getters: { siteLayoutConfigBySitePath } } = context
    await dispatch('getSiteLayoutConfig', { path: currentFolderPath })
    let sitePath = getFileSitePathByPath(currentFolderPath)
    let config = siteLayoutConfigBySitePath(sitePath)
    let { pages = null } = config || {}
    if (!pages) return
    let currentPagePath = currentFolderPath.replace(`${sitePath}/`, '')
    let newPagePath = newFolderPath.replace(`${sitePath}/`, '')
    let currentChildrenPages = childrenFiles
      .map(file => file.replace(`${sitePath}/`, ''))
      .filter(file => !/\.gitignore.md$/.test(file) && Object.keys(pages).includes(file))
    currentChildrenPages.forEach(pageName => {
      if (pages[pageName] && pages[pageName]['layout']) {
        let newPageName = pageName.replace(currentPagePath, newPagePath)
        pages[newPageName] = {}
        pages[newPageName]['layout'] = pages[pageName]['layout']
      }
    })
    pages = _.omit(pages, currentChildrenPages)
    let layoutConfig = _.get(config, 'layoutConfig')
    let unSaveConfig = {
      ...config,
      layoutConfig,
      pages
    }
    let content = JSON.stringify(unSaveConfig, null, 2)
    let layoutFilePath = LayoutHelper.layoutFilePath(sitePath)
    await dispatch('gitlab/saveFile', { path: layoutFilePath, content }, { root: true })
    commit(SAVE_SITE_LAYOUT_CONFIG_SUCCESS, { sitePath, config: unSaveConfig })
    dispatch('refreshSiteSettings', { sitePath }, { root: true })
  },
  async saveSiteBasicSetting(context, { newBasicMessage }) {
    let { commit } = context
    // await keepwork.website.updateByName(newBasicMessage)
    await keepwork.website.updateById(newBasicMessage)
    commit(UPDATE_SITE_MSG_SUCCESS, { newBasicMessage })
  },
  async createComment(context, { url: path, content }) {
    let { dispatch, commit, getters, rootGetters } = context
    let fullPath = getFileFullPathByPath(path)

    await dispatch('getProfile')
    let { userId } = getters
    await dispatch('getWebsiteDetailInfoByPath', { path })
    let { siteinfo: { _id: websiteId } } = rootGetters['user/getSiteDetailInfoByPath'](path)

    let payload = { websiteId, userId, url: fullPath, content }
    let { commentList } = await keepwork.websiteComment.create(payload)

    commit(CREATE_COMMENT_SUCCESS, { url: fullPath, commentList })
    await dispatch('getCommentsByPageUrl', { url: fullPath })
  },
  async createCommentForActivePage(context, { content }) {
    let { dispatch, rootGetters: { activePageUrl } } = context
    await dispatch('createComment', { url: activePageUrl, content })
  },
  async deleteCommentById(context, { _id, page }) {
    let { dispatch, commit } = context
    await keepwork.websiteComment.deleteById({ _id })

    commit(DELETE_COMMENT_SUCCESS, { _id })
    await dispatch('getActivePageComments', { page })
  },
  async getCommentsByPageUrl({ commit }, { url: path, page }) {
    let fullPath = getFileFullPathByPath(path)

    let { commentList, total } = await keepwork.websiteComment.getByPageUrl({ url: fullPath, page })

    commit(GET_COMMENTS_BY_PAGE_URL_SUCCESS, { url: fullPath, commentList, commentTotal: total })
  },
  async getActivePageComments(context, { page }) {
    let { dispatch, rootGetters: { activePageUrl } } = context
    await dispatch('getCommentsByPageUrl', { url: activePageUrl, page })
  },
  async starPages(context, { url }) {
    let { commit, dispatch, getters } = context
    await dispatch('getProfile')
    let { username } = getters
    let pageStarResult = await keepwork.pages.star({ url, visitor: username })
    commit(SET_PAGE_STAR_DETAIL, pageStarResult)
  },
  async initPageDetail(context, { url, visitor }) {
    let { commit } = context
    let pageDetail = await keepwork.pages.getDetail({ url, visitor })
    commit(SET_PAGE_STAR_DETAIL, pageDetail)
  },
  async refreshSkyDrive({ dispatch }, { useCache = true } = {}) {
    await Promise.all([
      dispatch('getInfoFromSkyDrive', { useCache }),
      dispatch('getFileListFromSkyDrive', { useCache })
    ])
  },
  async getInfoFromSkyDrive(context, { useCache = true } = {}) {
    let { commit, getters } = context
    let { username, skyDriveInfo } = getters
    if (useCache && !_.isEmpty(skyDriveInfo)) return

    let info = await skyDrive.info()
    commit(GET_FROM_SKY_DRIVE_SUCCESS, { username, info })
  },
  async getFileListFromSkyDrive(context, { useCache = true } = {}) {
    let { commit, getters } = context
    let { username, skyDriveFileList } = getters
    if (useCache && !_.isEmpty(skyDriveFileList)) return

    let filelist = await skyDrive.list({ pageSize: 10000000 })
    commit(GET_FROM_SKY_DRIVE_SUCCESS, { username, filelist })
    return filelist
  },
  async uploadFileToSkyDrive(context, { file, filename, onStart, onProgress }) {
    let { key } = await skyDrive.upload({ file, filename, onStart, onProgress })
    return { key }
  },
  async removeFileFromSkyDrive(context, { file }) {
    await skyDrive.remove({ file })
  },
  async changeFileNameInSkyDrive(context, { key, filename }) {
    await skyDrive.changeFileName({ key, filename })
  },
  async useFileInSite(context, { fileId, sitePath, useCache = true }) {
    let { commit, dispatch, getters, rootGetters } = context

    let { siteFileBySitePathAndFileId } = getters
    let cachedUrl = siteFileBySitePathAndFileId({ sitePath, fileId })
    if (useCache && !_.isEmpty(cachedUrl)) return

    await dispatch('getWebsiteDetailInfoByPath', { path: sitePath })
    let { siteinfo: { userId, _id: siteId } } = rootGetters['user/getSiteDetailInfoByPath'](sitePath)

    let url = await skyDrive.useFileInSite({ userId, siteId, fileId })
    commit(USE_FILE_IN_SITE_SUCCESS, { sitePath, fileId, url })
    return url
  },
  async uploadFileAndUseInSite({ dispatch }, { file, filename, sitePath, onStart, onProgress }) {
    let { key: fileKey } = await dispatch('uploadFileToSkyDrive', { file, filename, onStart, onProgress })
    let filelist = await dispatch('getFileListFromSkyDrive', { useCache: false })
    let fileUploaded = (filelist || []).filter(({ key }) => fileKey === key)[0]
    let { id: fileId } = fileUploaded
    let url = await dispatch('useFileInSite', { fileId, sitePath, useCache: false })
    return { file: fileUploaded, url }
  },
  async checkSensitive(context, { checkedWords }) {
    let result = await sensitiveWord.checkSensitiveWords(checkedWords)
    return result
  },
  async changePwd(context, { oldpassword, newpassword }) {
    // FIXME:
    let result = await keepwork.user.changePassword({ oldpassword, password: newpassword })
    return result
  },
  async getByEmail(context, { email }) {
    let result = await keepwork.user.getByEmail({ email })
    return result
  },
  async verifyEmailOne(context, { email, bind }) {
    return keepwork.user.verifyEmailOne({ email, bind })
  },
  async verifyEmailTwo(context, { email, bind, isApi, verifyCode }) {
    // FIXME:
    let { dispatch } = context
    let result = await keepwork.user.verifyEmailTwo({ email, bind, isApi, verifyCode })
    let message = result.error.message
    if (message === 'success') {
      await dispatch('getProfile', {
        useCache: false
      })
    }
    return message
  },
  async getUserThreeServiceByUsername(context, { username }) {
    let { commit } = context
    // let userThreeServices = await keepwork.userThreeService.getByUsername({ username })
    let userThreeServices = await keepwork.userThreeService.getOauthUsers()
    commit(GET_USER_THREE_SERVICES_SUCCESS, userThreeServices)
  },
  async threeServiceDeleteById(context, { id, username }) {
    let { dispatch } = context
    await keepwork.userThreeService.deleteById({ id })
    await dispatch('getUserThreeServiceByUsername', { username })
  },
  async threeServiceUnbind(context, { id, password, username }) {
    let { dispatch } = context
    let unbindResut = { status: '' }
    await keepwork.userThreeService.unbind({ id, password }).then(async () => {
      await dispatch('getUserThreeServiceByUsername', { username })
      unbindResut.status = 'success'
    }).catch(() => {
      unbindResut.status = 'failed'
    })
    return unbindResut
  },
  async unbindCellphone(context, { password }) {
    let { dispatch } = context
    let unbindResut = { status: '' }
    await keepwork.user.unbindCellphone({ password }).then(async () => {
      await dispatch('getProfile', {
        useCache: false
      })
      unbindResut.status = 'success'
    }).catch(() => {
      unbindResut.status = 'failed'
    })
    return unbindResut
  },
  async unbindEmail(context, { password }) {
    let { dispatch } = context
    let unbindResut = { status: '' }
    await keepwork.user.unbindEmail({ password }).then(async () => {
      await dispatch('getProfile', {
        useCache: false
      })
      unbindResut.status = 'success'
    }).catch(() => {
      unbindResut.status = 'failed'
    })
    return unbindResut
  }
}

export default actions
