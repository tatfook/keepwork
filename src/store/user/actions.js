import _ from 'lodash'
import { keepwork, GitAPI, skyDrive, sensitiveWord } from '@/api'
import { props } from './mutations'
import { getFileFullPathByPath, getFileSitePathByPath, webTemplateProject } from '@/lib/utils/gitlab'
import { showRawForGuest as gitlabShowRawForGuest } from '@/api/gitlab'
import LayoutHelper from '@/lib/mod/layout'
import ThemeHelper from '@/lib/theme'
import Cookies from 'js-cookie'

const {
  LOGIN_SUCCESS,
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
  SET_AUTH_CODE_INFO
} = props

const actions = {
  async login({ commit }, payload) {
    let info = await keepwork.user.login(payload)
    commit(LOGIN_SUCCESS, info)
  },
  /*doc
    getProfile

    getProfile({forceLogin: false})
    can be called without username,
    only uses cookie info;
    dispatch this action first, in any action which depends on username.
  */
  getProfile: (() => {
    let getProfilePromise
    let clearGetProfilePromise = () => (getProfilePromise = null)

    return async (context, {forceLogin = true, useCache = true} = {}) => {
      let { commit, dispatch, getters: { isLogined, authRequestConfig, token } } = context
      if (isLogined && useCache) return

      getProfilePromise = getProfilePromise || new Promise((resolve, reject) => {
        keepwork.user.getProfile(null, authRequestConfig).then(profile => {
          commit(GET_PROFILE_SUCCESS, {...profile, token})
          Cookies.set('token', token)
          resolve()
        }).catch(async e => {
          if (!forceLogin) {
            reject(new Error('401'))
            clearGetProfilePromise()
            return
          }

          alert('尚未登陆，请登陆后访问！')
          // login for localhost test
          if (process.env.HOST_ENV === 'localhost') {
            let payload = {
              username: prompt('username: '),
              password: prompt('password: ')
            }
            clearGetProfilePromise()
            if (!payload.username || !payload.password) {
              reject(new Error('401'))
              return
            }
            await dispatch('login', payload)
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
  async getUserDetailByUsername(context, { username }) {
    let { commit, getters: { usersDetail } } = context
    let userDetail = usersDetail && usersDetail[username]
    if (userDetail) {
      return
    }
    userDetail = await keepwork.user.getDetailByName({ username: username })
    commit(GET_USER_DETAIL_SUCCESS, { username, userDetail })
  },
  async updateUserInfo(context, userInfo) {
    let { commit, getters: { authRequestConfig, profile } } = context
    let newUserInfo = await keepwork.user.update(userInfo, authRequestConfig)
    commit(GET_PROFILE_SUCCESS, { ...profile, ...newUserInfo })
  },
  async verifyCellphoneOne(context, { setRealNameInfo, cellphone }) {
    let { commit, getters: { authRequestConfig } } = context
    let verifyInfoOne = await keepwork.user.verifyCellphoneOne({ setRealNameInfo, cellphone }, authRequestConfig, true)
    commit(SET_REAL_AUTH_PHONE_NUM, verifyInfoOne)
    return verifyInfoOne
  },
  async verifyCellphoneTwo(context, { setRealNameInfo, cellphone, smsCode, smsId, bind }) {
    let { dispatch, commit, getters: { authRequestConfig, sendCodeInfo } } = context
    smsId = smsId || (sendCodeInfo.data && sendCodeInfo.data.smsId)
    let verifyInfoTwo = await keepwork.user.verifyCellphoneTwo({setRealNameInfo, smsCode, smsId, bind}, authRequestConfig, true)
    await dispatch('getProfile', { useCache: false })
    commit(SET_AUTH_CODE_INFO, verifyInfoTwo)
    return verifyInfoTwo
  },
  async getAllPersonalPageList({ dispatch, getters }, payload) {
    let { useCache = true } = payload || {}
    await dispatch('getAllPersonalWebsite', { useCache })
    let { personalSitePathMap } = getters
    await Promise.all(_.keys(personalSitePathMap).map(async (sitepath) => {
      await dispatch('gitlab/getRepositoryTree', {path: sitepath, useCache}, { root: true })
    })).catch(e => console.error(e))
  },
  async getAllPersonalAndContributedSite({ dispatch }, payload) {
    let { useCache = true } = payload || {}
    await dispatch('getProfile')

    return Promise.all([
      dispatch('getAllPersonalWebsite', { useCache }),
      dispatch('getAllContributedWebsite', { useCache })
    ])
  },
  async getAllPersonalWebsite({ dispatch }, payload) {
    let { useCache = false } = payload || {}
    await dispatch('getProfile')

    return Promise.all([
      dispatch('getAllWebsite', { useCache }),
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
    let gitlabForGuest = new GitAPI({url: rawBaseUrl, token: ' '})
    fileList = await gitlabForGuest.getTree({projectId, path: `templates/${folder}`, recursive: true})
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
  async getAllWebsite(context, payload) {
    let { useCache = false } = payload || {}
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig, personalSiteList } = getters
    if (useCache && personalSiteList.length) return

    let list = await keepwork.website.getAllByUsername({username}, authRequestConfig)
    commit(GET_ALL_WEBSITE_SUCCESS, {username, list})
  },
  async getAllSiteDataSource(context, payload) {
    let { useCache = false } = payload || {}
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig, siteDataSourcesMap } = getters
    if (useCache && !_.isEmpty(siteDataSourcesMap)) return

    let list = await keepwork.siteDataSource.getByUsername({username}, authRequestConfig)
    commit(GET_SITE_DATASOURCE_SUCCESS, {username, list})
  },
  async getAllContributedWebsite(context, payload) {
    let { useCache = false } = payload || {}
    let { dispatch, commit, getters } = context
    await dispatch('getProfile')

    let { username, authRequestConfig, contributedSiteList } = getters
    if (useCache && !_.isEmpty(contributedSiteList)) return

    let list = await keepwork.siteUser.getSiteListByMemberName({memberName: username}, authRequestConfig)
    list = _.values(list).filter(({siteinfo, siteuser} = {}) => siteinfo && siteuser)

    commit(GET_CONTRIBUTED_WEBSITE_SUCCESS, {username, list})
  },
  async getWebsiteDetailInfoByPath(context, { path }) {
    let { commit, getters: { getSiteDetailInfoByPath } } = context
    if (getSiteDetailInfoByPath(path)) return

    let [username, sitename] = path.split('/').filter(x => x)
    let detailInfo = await keepwork.website.getDetailInfo({username, sitename})

    commit(GET_SITE_DETAIL_INFO_SUCCESS, {username, sitename, detailInfo})
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
    commit(GET_SITE_LAYOUT_CONFIG_SUCCESS, {sitePath, config})
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
    commit(SAVE_SITE_LAYOUT_CONFIG_SUCCESS, {sitePath, config: unsavedConfig})
    dispatch('refreshSiteSettings', {sitePath}, {root: true})
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
        config = ThemeHelper.defaultTheme()
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
      pages: pages
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
      pages: pages
    }
    let content = JSON.stringify(unSaveConfig, null, 2)
    let layoutFilePath = LayoutHelper.layoutFilePath(sitePath)
    await dispatch('gitlab/saveFile', { path: layoutFilePath, content }, { root: true })
    commit(SAVE_SITE_LAYOUT_CONFIG_SUCCESS, { sitePath, config: unSaveConfig })
    dispatch('refreshSiteSettings', { sitePath }, { root: true })
  },
  async saveSiteBasicSetting(context, {newBasicMessage}) {
    let { commit, getters } = context
    let { authRequestConfig } = getters
    await keepwork.website.updateByName(newBasicMessage, authRequestConfig)
    commit(UPDATE_SITE_MSG_SUCCESS, {newBasicMessage})
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
  },
  async refreshSkyDrive({ dispatch }, {useCache = true} = {}) {
    await Promise.all([
      dispatch('getInfoFromSkyDrive', {useCache}),
      dispatch('getFileListFromSkyDrive', {useCache})
    ])
  },
  async getInfoFromSkyDrive(context, {useCache = true} = {}) {
    let { commit, dispatch, getters } = context
    let { username, skyDriveInfo, authRequestConfig } = getters
    if (useCache && !_.isEmpty(skyDriveInfo)) return

    await dispatch('getProfile')
    let info = await skyDrive.info(null, authRequestConfig)
    commit(GET_FROM_SKY_DRIVE_SUCCESS, { username, info })
  },
  async getFileListFromSkyDrive(context, {useCache = true} = {}) {
    let { commit, dispatch, getters } = context
    let { username, skyDriveFileList, authRequestConfig } = getters
    if (useCache && !_.isEmpty(skyDriveFileList)) return

    await dispatch('getProfile')
    let filelist = await skyDrive.list({pageSize: 100000}, authRequestConfig)
    commit(GET_FROM_SKY_DRIVE_SUCCESS, { username, filelist })
  },
  async uploadFileToSkyDrive(context, {file, onStart, onProgress}) {
    let { dispatch, getters: { authRequestConfig } } = context
    await dispatch('getProfile')
    let url = await skyDrive.upload({file, onStart, onProgress}, authRequestConfig)
    return url
  },
  async removeFileFromSkyDrive(context, {file}) {
    let { getters: { authRequestConfig } } = context
    await skyDrive.remove({file}, authRequestConfig)
  },
  async changeFileNameInSkyDrive(context, {key, filename}) {
    let { getters: { authRequestConfig } } = context
    await skyDrive.changeFileName({key, filename}, authRequestConfig)
  },
  async useFileInSite(context, {fileId, sitePath, useCache = true}) {
    let { commit, dispatch, getters, rootGetters } = context

    let { authRequestConfig, siteFileBySitePathAndFileId } = getters
    let cachedUrl = siteFileBySitePathAndFileId({sitePath, fileId})
    if (useCache && !_.isEmpty(cachedUrl)) return

    await dispatch('getWebsiteDetailInfoByPath', { path: sitePath })
    let { siteinfo: { userId, _id: siteId } } = rootGetters['user/getSiteDetailInfoByPath'](sitePath)

    let url = await skyDrive.useFileInSite({userId, siteId, fileId}, authRequestConfig)
    commit(USE_FILE_IN_SITE_SUCCESS, {sitePath, fileId, url})
  },
  async checkSensitive(context, {checkedWords}) {
    let result = await sensitiveWord.checkSensitiveWords(checkedWords)
    return result
  },
  async changePwd(context, { oldpassword, newpassword }) {
    let { getters } = context
    let { authRequestConfig } = getters
    let result = await keepwork.user.changepw({ oldpassword, newpassword }, authRequestConfig, { returnOriginalData: true })
    return result.error.message
  },
  async getByEmail(context, { email }) {
    let result = await keepwork.user.getByEmail({ email })
    return result
  },
  async verifyEmailOne(context, { email, bind }) {
    let { getters } = context
    let { authRequestConfig } = getters
    let result = await keepwork.user.verifyEmailOne({ email, bind }, authRequestConfig)
    return result
  },
  async verifyEmailTwo(context, { email, bind, isApi, verifyCode }) {
    let { getters, dispatch } = context
    let { authRequestConfig } = getters
    let result = await keepwork.user.verifyEmailTwo({ email, bind, isApi, verifyCode }, authRequestConfig, { returnOriginalData: true })
    let message = result.error.message
    if (message === 'success') {
      await dispatch('getProfile', {
        useCache: false
      })
    }
    return message
  }
}

export default actions
