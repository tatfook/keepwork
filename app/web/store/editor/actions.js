import _ from 'lodash'
import ModFactory from '@/lib/mod/factory'
import Parser from '@/lib/mod/parser'
import BlockHelper from '@/lib/mod/parser/blockHelper'
import CmdHelper from '@/lib/mod/parser/cmdHelper'
import UndoHelper from '@/lib/utils/undo/undoHelper'
import LayoutHelper from '@/lib/mod/layout'
import { gConst } from '@/lib/global'
import { props } from './mutations'
import {
  getFileFullPathByPath,
  getFileSitePathByPath,
  CONFIG_FOLDER_NAME
} from '@/lib/utils/gitlab'
import jsrsasign from 'jsrsasign'
import { initPageState, initSiteState, initLayoutPageState } from './state'

import io from 'socket.io-client'

let socketInstance = null
const createSocket = ({ token, callback }) => {
  if (socketInstance) {
    return socketInstance
  }
  const jwtInfo = jsrsasign.KJUR.jws.JWS.readSafeJSONString(
    jsrsasign.b64utoutf8(token.split('.')[1])
  )
  const userId = jwtInfo.userId
  socketInstance = io(process.env.SOCKET_API_PREFIX, {
    query: {
      userId,
      token
    },
    transports: ['websocket']
  })
  socketInstance.on('app/msg', callback)
  return socketInstance
}

const {
  SET_ACTIVE_PAGE,
  SET_ACTIVE_PAGE_URL,

  ADD_MOD,
  DELETE_MOD,
  MOVE_MOD,
  SET_PRE_MOD_KEY,
  SET_IS_MULTIPLE_TEXT_DIALOG_SHOW,

  SET_ACTIVE_MOD,
  SET_ACTIVE_SUB_MOD,
  SET_ACTIVE_PROPERTY,
  SET_ACTIVE_PROPERTY_OPTIONS,
  SET_ACTIVE_PROPERTY_DATA,
  SET_ACTIVE_AREA,

  UPDATE_ACTIVE_MOD_ATTRIBUTES,
  UPDATE_ACTIVE_MOD_ATTRIBUTES_LIST,
  UPDATE_MODS,
  UPDATE_THEME_NAME,
  UPDATE_THEME_COLOR,
  UPDATE_THEME_BG_COLOR,
  UPDATE_THEME_FONT,

  UPDATE_MANAGE_PANE_COMPONENT,
  UPDATE_PROPERTY_TAB_TYPE,
  RESET_SHOWING_COL,

  UPDATE_FILEMANAGER_TREE_NODE_EXPANDED,

  LOAD_PAGE_DATA,
  ADD_OPENED_FILE,
  UPDATE_OPENED_FILE,
  CLOSE_OPENED_FILE,
  CLOSE_ALL_OPENED_FILE,

  SET_EDITING_AREA,
  SET_NEW_MOD_POSITION,

  REFRESH_SITE_SETTINGS,
  UPDATE_OPENED_LAYOUT_FILE,

  UPDATE_CURSOR_POSITION,

  UNDO,
  REDO,
  SAVE_HISTORY,
  INIT_UNDO,
  TOGGLE_SKY_DRIVE,
  ADD_RECENT_OPENED_SITE,
  TOGGLE_FILE_HISTORY,
  TOGGLE_ANGLES,
  TOGGLE_IFRAME_DIALOG,

  UPDATE_OPENED_WEBSITES
} = props

const actions = {
  // Page
  async setActivePage(context, { path, editorMode = true }) {
    path = decodeURIComponent(path)
    let { state, getters, commit, dispatch } = context
    // load profile and websites info to get correct projectIds for reading files
    // await dispatch('user/getAllPersonalAndContributedSite', {root: true})
    let { 'user/username': username } = context.rootGetters
    if (path === '/') return commit(SET_ACTIVE_PAGE, { path, username })
    const fullPath = getFileFullPathByPath(path)
    const sitePath = getFileSitePathByPath(path)
    const siteData = state.siteSettings[sitePath]

    if (!siteData) {
      await dispatch('refreshSiteSettings', { sitePath })
    }

    const pageData = getters.openedPages[fullPath]
    const needReload = !pageData
    if (needReload) {
      await dispatch('loadActivePage', { path, editorMode })
    }

    commit(SET_ACTIVE_PAGE, { path, username })
    await dispatch('refreshModList')
    await dispatch('refreshCode')

    if (needReload) {
      commit(INIT_UNDO, {
        newCode: getters.code,
        cursor: { line: 0, ch: 0 }
      })
    }
  },
  async loadActivePage(
    { commit, dispatch, getters },
    { path, editorMode = true }
  ) {
    const fullPath = getFileFullPathByPath(path)
    let file = getters.openedFiles[fullPath]
    if (!file) await dispatch('openFile', { path, editorMode })

    file = getters.openedFiles[fullPath]
    if (file) {
      let pageData = initPageState()
      pageData.file = file
      pageData.modList = Parser.buildBlockList(file.content)
      commit(LOAD_PAGE_DATA, { path: fullPath, pageData })
    }
  },
  async saveActivePage({ getters, dispatch }) {
    let { activePageUrl, layoutPages } = getters
    await dispatch('savePageByPath', activePageUrl)
    // Save layout files
    for (let i = 0; i < layoutPages.length; i++) {
      let pageData = layoutPages[i]
      if (!pageData.saved) {
        await dispatch('saveSiteConfigPage', pageData)
      }
    }
  },
  async savePageByPath(
    {
      getters: { getOpenedFileByPath },
      dispatch
    },
    path
  ) {
    if (!path) return
    let { content, saved } = getOpenedFileByPath(path)
    if (!saved) {
      const { commit } = await dispatch('gitlab/saveFile', { content, path }, { root: true })
      dispatch('updateOpenedFile', { saved: true, path })
      dispatch('broadcastTheRoom', { path, type: 'update', commit })
    }
  },

  // siteSetting
  async refreshSiteSettings({ commit, dispatch, rootGetters }, { sitePath }) {
    let siteSetting = initSiteState()

    await dispatch('user/getSiteLayoutConfig', { path: sitePath })
    await dispatch('user/getSiteThemeConfig', { path: sitePath })
    let {
      'user/siteLayoutConfigBySitePath': siteLayoutConfigBySitePath,
      'user/siteThemeConfigBySitePath': siteThemeConfigBySitePath,
      'user/allLayoutContentFilePathsBySitePath': allLayoutContentFilePathsBySitePath,
      'gitlab/getFileByPath': gitlabGetFileByPath
    } = rootGetters
    siteSetting.siteLayoutConfig = siteLayoutConfigBySitePath(sitePath)
    siteSetting.theme = siteThemeConfigBySitePath(sitePath)
    let allLayoutContentFilePaths = allLayoutContentFilePathsBySitePath(
      sitePath
    )

    await Promise.all(
      allLayoutContentFilePaths.map(async layoutContentFilePath => {
        let fileName = layoutContentFilePath
          .split('/')
          .slice(1)
          .join('/')
        let filePath = `${sitePath}/${CONFIG_FOLDER_NAME}/pages/${layoutContentFilePath}`
        await dispatch(
          'gitlab/readFile',
          { path: filePath, editorMode: true },
          { root: true }
        )
        let { content } = gitlabGetFileByPath(filePath)
        siteSetting.pages[layoutContentFilePath] = initLayoutPageState()
        _.merge(siteSetting.pages[layoutContentFilePath], {
          content,
          modList: Parser.buildBlockList(content),
          path: filePath,
          fileName
        })
      })
    ).catch(e => console.error(e))

    commit(REFRESH_SITE_SETTINGS, { sitePath, siteSetting })
  },
  async updateOpenedLayoutFile({ getters, commit }, payload) {
    let { sitePath, activeArea, activeAreaData } = getters
    commit(UPDATE_OPENED_LAYOUT_FILE, {
      sitePath,
      layoutContentFilePath: `${activeArea}s/${activeAreaData.fileName}`,
      data: payload
    })
  },

  // Files
  async loadFile(
    { commit, dispatch, rootGetters, getters },
    { path, editorMode = true, showVersion = false }
  ) {
    await dispatch('gitlab/readFile', { path, editorMode, showVersion }, { root: true })
    let {
      'gitlab/getFileByPath': gitlabGetFileByPath,
      'user/username': username
    } = rootGetters
    let file = gitlabGetFileByPath(path)
    if (!file) return
    let { content, _id, commit: _commit } = file

    let fullPath = getFileFullPathByPath(path)
    let timestamp = Date.now()
    let saved = true
    let commitPayload = {
      username,
      path: fullPath,
      data: { timestamp, path, content, saved, _id, ..._commit }
    }
    return commitPayload
  },
  async openFile({ dispatch, commit }, { path, editorMode = true }) {
    let payload = await dispatch('loadFile', { path, editorMode, showVersion: true })
    commit(ADD_OPENED_FILE, payload)
    dispatch('addOpenedWebsite', { path: getFileFullPathByPath(path) })
  },
  async refreshOpenedFile(
    { commit, dispatch, getters },
    { path, editorMode = true }
  ) {
    let payload = await dispatch('loadFile', { path, editorMode, showVersion: true })
    commit(UPDATE_OPENED_FILE, payload)
    dispatch('addOpenedWebsite', { path: getFileFullPathByPath(path) })
    let fullPath = getFileFullPathByPath(path)
    if (getFileFullPathByPath(getters.activePageUrl) === fullPath) {
      dispatch('refreshModList')
    }
  },
  updateOpenedFile(context, payload) {
    let { path } = payload
    let fullPath = getFileFullPathByPath(path)
    let { commit, rootGetters } = context
    let { 'user/username': username } = rootGetters

    let timestamp = Date.now()
    let commitPayload = {
      username,
      path: fullPath,
      data: { timestamp, ...payload }
    }
    commit(UPDATE_OPENED_FILE, commitPayload)
  },
  closeOpenedFile(context, { path }) {
    let fullPath = getFileFullPathByPath(path)
    let {
      commit,
      dispatch,
      state,
      rootGetters: { 'user/username': username }
    } = context
    commit(CLOSE_OPENED_FILE, { username, path: fullPath })
    dispatch('closeOpenedWebsite', { path: fullPath })
    if (path === state.activePageUrl) {
      commit(SET_ACTIVE_PAGE, null)
    }
  },
  closeAllOpenedFile({ commit, dispatch, rootGetters }) {
    let { 'user/username': username } = rootGetters
    dispatch('closeAllOpenedWebsite')
    commit(CLOSE_ALL_OPENED_FILE, { username })
  },

  // codes
  updateCode(
    { dispatch, getters, commit },
    { code: newCode, historyDisabled, cursor }
  ) {
    let { code: oldCode, activePageUrl: path, activeArea } = getters
    if (newCode === oldCode) return
    if (activeArea === LayoutHelper.Const.MAIN_AREA) {
      dispatch('updateOpenedFile', { content: newCode, saved: false, path })
    } else {
      dispatch('updateOpenedLayoutFile', { content: newCode, saved: false })
    }
    if (!historyDisabled) {
      commit(SAVE_HISTORY, { newCode, cursor })
    }
  },
  refreshCode({ dispatch, getters: { modList } }) {
    const code = Parser.buildMarkdown(modList)
    dispatch('updateCode', { code })
  },
  refreshModList({ commit, getters: { code, activeMod } }) {
    let blockList = Parser.buildBlockList(code)
    commit(UPDATE_MODS, blockList)
    if (activeMod && activeMod.cmd !== CmdHelper.MARKDOWN_CMD) {
      commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    }
  },
  // rebuild all mods, will takes a little bit more time
  async updateMarkDown({ dispatch }, payload) {
    if (payload.code === undefined) payload = { code: payload }
    await dispatch('updateCode', payload)
    await dispatch('refreshModList')
  },

  // adi mod
  moveMod({ commit, dispatch }, payload) {
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(MOVE_MOD, payload)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    dispatch('refreshCode')
  },
  addMod({ dispatch, getters }, payload) {
    if (getters.activePage.addingArea === gConst.ADDING_AREA_ADI) {
      dispatch('addModToAdi', payload)
    } else {
      dispatch('addModToMarkdown', payload)
    }
  },
  setPreMod({ commit }, { key = '' }) {
    commit(SET_PRE_MOD_KEY, key)
  },
  setIsMultipleTextDialogShow({ commit }, { isShow = false }) {
    commit(SET_IS_MULTIPLE_TEXT_DIALOG_SHOW, isShow)
  },
  addModToAdi({ commit, dispatch }, payload) {
    let modProperties = ModFactory.generateProperties(payload.modName)
    modProperties.styleID = payload.styleID || modProperties.styleID
    modProperties = _.merge(modProperties, payload.modProperties)
    let newMod = Parser.buildBlock(
      Parser.getCmd(payload.modName),
      modProperties
    )
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(ADD_MOD, {
      newMod,
      key: payload.preModKey
    })
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    dispatch('refreshCode')
  },
  async addModToMarkdown({ commit, dispatch, getters }, payload) {
    // this function will causes add bigfile fail
    let modProperties = ModFactory.generateProperties(payload.modName)
    modProperties.styleID = payload.styleID || modProperties.styleID
    modProperties = _.merge(modProperties, payload.modProperties)
    let newMod = Parser.buildBlock(
      Parser.getCmd(payload.modName),
      modProperties
    )
    payload.modContent = Parser.buildMarkdown([newMod])

    let position = getters.activePage.cursorPosition + 1
    const block = Parser.getBlockByCursorLine(getters.modList, position)
    if (block && !BlockHelper.isMarkdownMod(block)) {
      position = BlockHelper.endLine(block)
    }
    const newCode = Parser.addBlockToMarkdownWithoutHeadAndTail(
      getters.code,
      position,
      payload.modName,
      payload.modContent
    )
    commit(SET_EDITING_AREA, { area: gConst.ADDING_AREA_ADI }) // reset editing area after mod added
    await dispatch('updateMarkDown', { code: newCode })
    const mod = Parser.getActiveBlock(getters.modList, position + 2)
    commit(SET_ACTIVE_MOD, mod.key)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    dispatch('updateCursor', { cursor: { ch: 0, line: position + 2 } })
  },
  async addBigFileToMarkdown({ commit, dispatch, getters }, payload) {
    let position = getters.activePage.cursorPosition + 1
    const block = Parser.getBlockByCursorLine(getters.modList, position)
    if (block && !BlockHelper.isMarkdownMod(block)) {
      position = BlockHelper.endLine(block)
    }
    const newCode = Parser.addBlockToMarkdown(
      getters.code,
      position,
      payload.modName,
      payload.modContent
    )
    commit(SET_EDITING_AREA, { area: gConst.ADDING_AREA_ADI }) // reset editing area after mod added
    await dispatch('updateMarkDown', { code: newCode })
    const mod = Parser.getActiveBlock(getters.modList, position + 2)
    commit(SET_ACTIVE_MOD, mod.key)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    dispatch('updateCursor', { cursor: { ch: 0, line: position + 2 } })
  },
  updateCursor({ commit, dispatch }, payload) {
    commit(UPDATE_CURSOR_POSITION, payload.cursor)
  },
  setNewModPosition({ commit }, position) {
    commit(SET_NEW_MOD_POSITION, position)
  },
  setAddingArea({ commit }, payload) {
    commit(SET_EDITING_AREA, payload)
  },
  setActiveMod({ commit }, key) {
    commit(SET_PRE_MOD_KEY, '')
    commit(SET_ACTIVE_PROPERTY, null)
    commit(SET_ACTIVE_SUB_MOD, null)
    commit(SET_ACTIVE_MOD, key)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
  },
  setActiveSubMod({ commit }, payload) {
    commit(SET_ACTIVE_SUB_MOD, null)
    commit(SET_ACTIVE_SUB_MOD, payload)
  },
  setActiveProperty({ commit, dispatch, getters }, payload) {
    const { activeMod } = getters
    commit(SET_PRE_MOD_KEY, '')
    if (payload.key && (!activeMod || payload.key !== activeMod.key)) {
      dispatch('setActiveMod', payload.key)
    }
    commit(SET_ACTIVE_PROPERTY, payload.property)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    dispatch('setActivePropertyTabType', 'attr')
  },
  setActivePropertyOptions({ commit }, playload) {
    commit(SET_ACTIVE_PROPERTY_OPTIONS, playload)
  },
  setActivePropertyTabType({ commit }, type) {
    commit(UPDATE_PROPERTY_TAB_TYPE, type)
  },
  setActivePropertyData(
    {
      commit,
      dispatch,
      getters: { activePropertyData, activeSubMod }
    },
    { data }
  ) {
    commit(SET_ACTIVE_PROPERTY_DATA, { activePropertyData, data, updateSubMod: !!activeSubMod })
    dispatch('refreshCode')
  },
  async setActiveArea({ commit, getters, dispatch }, area) {
    let { activeArea, activeAreaData, activeAreaFile } = getters
    if (activeArea === area) return
    // save current area unless it is main area
    if (
      activeArea &&
      activeAreaData &&
      activeArea !== LayoutHelper.Const.MAIN_AREA &&
      !activeAreaFile.saved
    ) {
      await dispatch('saveSiteConfigPage', activeAreaData)
    }
    commit(SET_ACTIVE_AREA, area)
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModsList')
    await dispatch('refreshCode')
  },
  async saveSiteConfigPage({ commit, dispatch }, { content, path }) {
    await dispatch('gitlab/saveFile', { content, path }, { root: true })
    let [username, sitename, , , areanames, filename] = path.split('/')
    commit(UPDATE_OPENED_LAYOUT_FILE, {
      sitePath: `${username}/${sitename}`,
      layoutContentFilePath: `${areanames}/${filename}`,
      data: { saved: true }
    })
  },
  deleteMod({ commit, dispatch, state }, key) {
    commit(DELETE_MOD, key)
    if (key === _.get(state, ['activePage', 'activeMod', 'key'])) {
      commit(SET_ACTIVE_MOD, null)
      commit(SET_ACTIVE_PROPERTY, null)
      commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModsList')
    }
    dispatch('refreshCode')
  },
  updateActiveModStyle({ commit, dispatch }, styleID) {
    commit(UPDATE_ACTIVE_MOD_ATTRIBUTES, {
      key: 'styleID',
      value: styleID
    })
    dispatch('refreshCode')
  },
  updateActiveModAttribute({ commit, dispatch }, payload) {
    commit(UPDATE_ACTIVE_MOD_ATTRIBUTES, payload)
    dispatch('refreshCode')
  },
  updateActiveModAttributeList({ commit, dispatch, getters }, payload) {
    if (payload.action === 'EDIT') {
      let { activeMod } = getters
      let activeModConf = ModFactory.load(activeMod.modType)
      let subModType = activeModConf.modSettings[payload.key].modType
      commit(SET_ACTIVE_PROPERTY, null)
      dispatch('setActiveSubMod', {
        modType: subModType,
        childProperty: payload.index,
        parentProperty: payload.key,
        data: activeMod.data[payload.key].collection[payload.index]
      })
    } else {
      commit(UPDATE_ACTIVE_MOD_ATTRIBUTES_LIST, payload)
      dispatch('refreshCode')
    }
  },
  // themes
  changeTheme({ commit }, themeName) {
    commit(UPDATE_THEME_NAME, themeName)
    commit(UPDATE_THEME_COLOR, 0)
    commit(UPDATE_THEME_FONT, 0)
    commit(UPDATE_THEME_BG_COLOR, 0)
  },
  changeThemeColor({ commit }, colorID) {
    commit(UPDATE_THEME_COLOR, colorID)
  },
  changeThemeBgColor({ commit }, bgColorID) {
    commit(UPDATE_THEME_BG_COLOR, bgColorID)
  },
  changeThemeFont({ commit }, fontID) {
    commit(UPDATE_THEME_FONT, fontID)
  },
  setActiveManagePaneComponent({ commit }, payload) {
    commit(UPDATE_MANAGE_PANE_COMPONENT, payload)
  },
  resetShowingCol({ commit }, showingColObj) {
    commit(RESET_SHOWING_COL, showingColObj)
  },
  updateFilemanagerTreeNodeExpandMapByPath({ commit }, payload) {
    commit(UPDATE_FILEMANAGER_TREE_NODE_EXPANDED, payload)
  },

  // undo manager
  undo({ commit, dispatch }) {
    commit(UNDO)
    dispatch('resetCurrentItem')
  },
  redo({ commit, dispatch }) {
    commit(REDO)
    dispatch('resetCurrentItem')
  },
  resetCurrentItem({ getters, dispatch }) {
    const currentItem = UndoHelper.currentItem(
      getters.activeAreaData.undoManager
    )
    let code = currentItem.newCode || ''
    let cursor = currentItem.cursor || { line: 0, ch: 0 }
    dispatch('updateMarkDown', { code, historyDisabled: true })
    dispatch('updateCursor', { cursor })
  },
  toggleSkyDrive({ commit }, { showSkyDrive }) {
    commit(TOGGLE_SKY_DRIVE, { showSkyDrive })
  },
  addRecentOpenedSiteUrl(context, { updateRecentUrlList }) {
    let {
      commit,
      rootGetters: { 'user/username': username }
    } = context
    commit(ADD_RECENT_OPENED_SITE, { updateRecentUrlList, username })
  },
  toggleAngles({ commit }, { showAngle }) {
    commit(TOGGLE_ANGLES, { showAngle })
  },
  toggleFileHistoryVisibility({ commit }, { isVisible }) {
    commit(TOGGLE_FILE_HISTORY, { isVisible })
  },
  toggleIframeDialog({ commit }, payload) {
    commit(TOGGLE_IFRAME_DIALOG, payload)
  },
  async joinTheRoom({ getters: { openedFiles } }, { websiteName, path = '' }) {
    websiteName = websiteName || getFileSitePathByPath(path)
    socketInstance.emit('app/join', { room: websiteName })
  },
  async leaveTheRoom({ getters: { openedFiles } }, { websiteName, path = '' }) {
    websiteName = websiteName || getFileSitePathByPath(path)
    socketInstance.emit('app/leave', { room: websiteName })
  },
  async broadcastTheRoom({ getters: { code }, rootGetters: { 'user/username': username } }, { path = '', type = 'update', ...rest }) {
    const websiteName = getFileSitePathByPath(path)
    const fullPath = getFileFullPathByPath(path)
    socketInstance.emit('app/msg', { target: websiteName, payload: { websiteName, path: fullPath, username, content: code, type, timestamp: Date.now(), ...rest } })
  },
  addOpenedWebsite({ commit, dispatch, getters: { openedWebsites, openedFiles } }, { path }) {
    const websiteName = getFileSitePathByPath(path)
    const fullPath = getFileFullPathByPath(path)
    commit(UPDATE_OPENED_WEBSITES, {
      ...openedWebsites,
      [websiteName]: {
        ...openedWebsites[websiteName],
        [path]: openedFiles[fullPath]
      }
    })
    dispatch('joinTheRoom', { websiteName, path })
  },
  closeOpenedWebsite({ commit, dispatch, getters: { openedWebsites } }, { websiteName, path }) {
    websiteName = websiteName || getFileSitePathByPath(path)
    const _openedWebsites = _.cloneDeep(openedWebsites)
    _.unset(_openedWebsites, [websiteName, path])
    if (_.isEmpty(_openedWebsites[websiteName])) {
      _.unset(_openedWebsites, [websiteName])
      dispatch('leaveTheRoom', { websiteName, path })
    }
    commit(UPDATE_OPENED_WEBSITES, _openedWebsites)
  },
  closeAllOpenedWebsite({ commit, dispatch, getters: { openedWebsites } }) {
    const openedWebsitesName = _.keys(openedWebsites)
    _.forEach((openedWebsitesName), websiteName => {
      dispatch('leaveTheRoom', { websiteName })
    })
    commit(UPDATE_OPENED_WEBSITES, {})
  },
  initSocket({ dispatch, rootGetters: { 'user/token': token } }) {
    createSocket({ token, callback: data => dispatch('disposeData', data) })
    dispatch('recoverDataAndSocket')
  },
  async recoverDataAndSocket({ commit, dispatch, getters: { openedFiles } }) {
    const openedPagesName = _.keys(openedFiles)
    const websitesGroup = _.reduce(openedPagesName, (group, path) => {
      const websiteName = getFileSitePathByPath(path)
      const fullPath = getFileFullPathByPath(path)
      _.set(group, [websiteName, path], openedFiles[fullPath])
      return group
    }, {})
    commit(UPDATE_OPENED_WEBSITES, websitesGroup)
    const openedWebsitesName = _.keys(websitesGroup)
    if (openedWebsitesName.length) {
      socketInstance.emit('app/join', { room: openedWebsitesName })
    }
    dispatch('checkOpenedFilesVersion')
  },
  async checkOpenedFilesVersion({ commit, dispatch, getters: { openedFiles, openedWebsites, activePageUrl }, rootGetters: { 'user/username': localUsername } }) {
    const openedFilesPath = _.keys(openedFiles)
    if (openedFilesPath.length) {
      const _openedWebsites = _.cloneDeep(openedWebsites)
      const fetchLatestArr = _.map(openedFilesPath, path => dispatch('getLatestVersion', { path }, { root: true }))
      const versionArr = await Promise.all(fetchLatestArr)
      if (versionArr.length) {
        _.forEach(versionArr, ({ websiteName, path, data }) => {
          const localFileVersion = _.get(_openedWebsites, [websiteName, path, 'version'], 0)
          const { commit: latestFileInfo, ...rest } = data
          console.log(localUsername)
          console.log(latestFileInfo)
          console.log(localFileVersion)
          console.log(_openedWebsites)
          console.log(localUsername === _.get(latestFileInfo, 'author_name', ''))
          console.log(localFileVersion < _.get(latestFileInfo, 'version'))
          console.log('*'.repeat(20))
          if (localUsername === _.get(latestFileInfo, 'author_name', '') && localFileVersion < _.get(latestFileInfo, 'version')) {
            dispatch('updateOpenedFile', { ...latestFileInfo, ...rest, path, saved: true })
            return
          }
          _openedWebsites[websiteName][path]['updated'] = data
        })
        commit(UPDATE_OPENED_WEBSITES, _openedWebsites)
      }
      dispatch('refreshModList')
    }
  },
  async getLatestVersion({ dispatch }, { path }) {
    const websiteName = getFileSitePathByPath(path)
    const data = await dispatch('gitlab/getFileLatestVersion', { path }, { root: true })
    return {
      websiteName,
      path,
      data
    }
  },
  disposeData({ dispatch, rootGetters: { 'user/username': localUsername } }, data) {
    const { payload, meta } = data
    const { type = 'update', username = '' } = payload
    if (username === localUsername && meta.client !== socketInstance.id) {
      dispatch(`async${_.upperFirst(type)}`, payload)
      return
    }
    if (username !== localUsername) {
      dispatch(`dispose${_.upperFirst(type)}`, payload)
    }
  },
  async asyncUpdate({ dispatch, commit, getters: { openedFiles, activePageUrl } }, { path, username, content, timestamp }) {
    if (_.includes(_.keys(openedFiles), path)) {
      commit(UPDATE_OPENED_FILE, { data: { content, path, saved: true, timestamp }, path, username })
      if (getFileFullPathByPath(activePageUrl) === path) {
        dispatch('refreshModList')
      }
    }
  },
  async asyncDelete({ dispatch, getters: { activePageUrl } }, { path }) {
    const websiteName = getFileSitePathByPath(path)
    const fullPath = getFileFullPathByPath(path)
    const activeFullPath = getFileFullPathByPath(activePageUrl)
    if (fullPath === activeFullPath) {
      dispatch('setActivePage', { path: '/' })
      window.history && window.history.replaceState(null, null, '/ed')
    }
    dispatch('closeOpenedFile', { path: fullPath })
    dispatch('gitlab/getRepositoryTree', {
      path: websiteName,
      useCache: false
    })
  },
  async asyncCreate({ dispatch }, { path }) {
    const websiteName = getFileSitePathByPath(path)
    dispatch('gitlab/getRepositoryTree', {
      path: websiteName,
      useCache: false
    })
  },
  async asyncRename({ dispatch }, { path }) {
    console.log('asyncRename >', path)
  },
  disposeUpdate({ commit, getters: { openedFiles, openedWebsites } }, payload) {
    const { websiteName, path, ...updated } = payload
    const fullPath = getFileFullPathByPath(path)
    const localFile = openedFiles[fullPath]
    if (localFile) {
      commit(UPDATE_OPENED_WEBSITES, {
        ...openedWebsites,
        [websiteName]: {
          ...openedWebsites[websiteName],
          [fullPath]: { ...localFile, updated }
        }
      })
    }
  },
  disposeDelete(context, payload) {
    // TODO:如果该文档正在编辑，改如何处理？
    console.warn('delete')
  },
  disposeMove(context, payload) {
    // TODO: 如果该文档正在编辑的情况下，被别人移动了，需要如何处理？ 1.如果已经保存，则更新目录树应该就能解决。 2.如果未保存，那么就麻烦了。
    console.warn('move')
  },
  disposeRename(context, payload) {
    // TODO: 如果文档正在编辑，然后又被重命名了
    console.warn('rename')
  },
  disposeDestroyWebsite(context, payload) {
    // TODO: 直接提示后删除
    console.warn('destroyWebsite')
  }
}

export default actions
