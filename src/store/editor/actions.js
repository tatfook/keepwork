import _ from 'lodash'
import ModFactory from '@/lib/mod/factory'
import Parser from '@/lib/mod/parser'
import UndoHelper from '@/lib/utils/undo/undoHelper'
import LayoutHelper from '@/lib/mod/layout'
import { gConst } from '@/lib/global'
import { props } from './mutations'
import {
  getFileFullPathByPath,
  getFileSitePathByPath,
  CONFIG_FOLDER_NAME
} from '@/lib/utils/gitlab'
import { initPageState, initSiteState, initLayoutPageState } from './state'

const {
  SET_ACTIVE_PAGE,

  ADD_MOD,
  DELETE_MOD,
  MOVE_MOD,

  SET_ACTIVE_MOD,
  SET_ACTIVE_PROPERTY,
  SET_ACTIVE_PROPERTY_OPTIONS,
  REFRESH_MOD_ATTRIBUTES,
  SET_ACTIVE_PROPERTY_DATA,
  SET_ACTIVE_AREA,

  UPDATE_ACTIVE_MOD_ATTRIBUTES,
  UPDATE_MODS,
  UPDATE_THEME_NAME,
  UPDATE_THEME_COLOR,
  UPDATE_THEME_BG_COLOR,
  UPDATE_THEME_FONT,

  UPDATE_MANAGE_PANE_COMPONENT,
  UPDATE_PROPERTY_TAB_TYPE,
  RESET_SHOWING_COL,

  UPDATE_FILEMANAGER_TREE_NODE_EXPANDED,

  RESET_OPENED_FILE,
  UPDATE_OPENED_FILE,
  CLOSE_OPENED_FILE,

  SET_EDITING_AREA,
  SET_NEW_MOD_POSITION,

  REFRESH_SITE_SETTINGS,
  UPDATE_OPENED_LAYOUT_FILE,

  UPDATE_CURSOR_POSITION
} = props

const cacheAvailable = pageData => {
  if (_.isEmpty(pageData)) return false

  let savedExpires = 5 * 60 * 1000 // 5 mins
  let unsavedExpires = 2 * 24 * 60 * 60 * 1000 // 2 days
  let now = Date.now()

  let { timestamp, saved } = pageData
  let cachedTime = now - timestamp

  let saveExpired = cachedTime > savedExpires
  let unsavedExpired = cachedTime > unsavedExpires

  if (saved && !saveExpired) return true
  if (!saved && !unsavedExpired) return true

  return false
}

const actions = {
  async setActivePage(context, { path, editorMode = true }) {
    let {
      state,
      getters,
      commit,
      dispatch,
      rootGetters: { 'user/username': username }
    } = context

    if (path === '/') return commit(SET_ACTIVE_PAGE, { path, username })
    const fullPath = getFileFullPathByPath(path)
    const sitePath = getFileSitePathByPath(path)
    const siteData = state.siteSettings[sitePath]

    if (!cacheAvailable(siteData)) {
      await dispatch('refreshSiteSettings', { sitePath })
    }

    const pageData = getters.openedFiles[fullPath]
    if (!cacheAvailable(pageData)) {
      await dispatch('refreshOpenedFile', { path, editorMode })
    }
    await dispatch('refreshCode') // force refresh code after change activepage to make sure the code is the transferred one
    if (!_.get(getters.openedFiles, fullPath)) {
      UndoHelper.init(getters.activeAreaData.undoManager, {
        newCode: getters.code,
        cursor: { line: 1, ch: 0 }
      })
    }
    commit(SET_ACTIVE_PAGE, { path, username })
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
      await dispatch('gitlab/saveFile', { content, path }, { root: true })
      dispatch('updateOpenedFile', { saved: true, path })
    }
  },
  updateCode(
    { dispatch, getters },
    { code: newCode, historyDisabled, cursor }
  ) {
    let {
      code: oldCode,
      activePageUrl: path,
      activeAreaData,
      activeArea
    } = getters
    if (newCode === oldCode) return
    if (activeArea === LayoutHelper.Const.MAIN_AREA) {
      dispatch('updateOpenedFile', { content: newCode, saved: false, path })
    } else {
      dispatch('updateOpenedLayoutFile', { content: newCode, saved: false })
    }
    !historyDisabled &&
      UndoHelper.save(activeAreaData.undoManager, { newCode, cursor })
  },
  refreshCode({ dispatch, getters: { modList } }) {
    const code = Parser.buildMarkdown(modList)
    dispatch('updateCode', { code })
  },
  updateCursor({ commit, dispatch }, payload) {
    commit(UPDATE_CURSOR_POSITION, payload.cursor)
  },
  // rebuild all mods, will takes a little bit more time
  async updateMarkDown({ commit, dispatch }, payload) {
    if (payload.code === undefined) payload = { code: payload }
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    let blockList = Parser.buildBlockList(payload.code)
    commit(UPDATE_MODS, blockList)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'FileManager')
    await dispatch('updateCode', payload)
  },
  async insertNewLine({ dispatch, getters: { code } }, { newline }) {
    await dispatch('updateMarkDown', { code: `${code}\n${newline}` })
  },
  // only update a particular mod
  updateMarkDownBlock({ commit, dispatch }, payload) {
    dispatch('updateCode', payload)
    if (payload.modType !== 'ModMarkdown') {
      commit(SET_ACTIVE_MOD, payload.key)
      commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
      commit(SET_ACTIVE_PROPERTY, null)
    }
    commit(REFRESH_MOD_ATTRIBUTES, payload)
  },
  moveMod({ commit, dispatch }, payload) {
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(MOVE_MOD, payload)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    dispatch('refreshCode')
  },
  addMod({ commit, dispatch, getters }, payload) {
    if (getters.activePage.addingArea === gConst.ADDING_AREA_ADI) {
      dispatch('addModToAdi', payload)
    } else {
      dispatch('addModToMarkdown', payload)
    }
  },
  addModToAdi({ commit, dispatch }, payload) {
    const modProperties = ModFactory.generate(payload.modName)
    var modPropertiesStyle
    if (payload.styleID) {
      modPropertiesStyle = modProperties
      modPropertiesStyle.styleID = payload.styleID
    }
    let newMod = Parser.buildBlock(Parser.getCmd(payload.modName), modPropertiesStyle || modProperties)
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(ADD_MOD, {
      newMod: newMod,
      key: payload.preModKey
    })
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
    dispatch('refreshCode')
  },
  async addModToMarkdown({ commit, dispatch, getters }, payload) {
    const position = getters.activePage.cursorPosition
    const newCode = Parser.addBlockToMarkdown(
      getters.code,
      position,
      payload.modName,
      payload.styleID
    )
    commit(SET_EDITING_AREA, { area: gConst.ADDING_AREA_ADI }) // reset editing area after mod added
    await dispatch('updateMarkDown', { code: newCode })
    const mod = Parser.getActiveBlock(getters.modList, position + 3)
    commit(SET_ACTIVE_MOD, mod.key)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
  },
  setAddingArea({ commit }, payload) {
    commit(SET_EDITING_AREA, payload)
  },
  setActiveMod({ commit }, key) {
    commit(SET_ACTIVE_MOD, key)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModPropertyManager')
  },
  setActiveProperty({ commit, dispatch }, payload) {
    commit(SET_ACTIVE_MOD, payload.key)
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
      getters: { activePropertyData }
    },
    { data }
  ) {
    commit(SET_ACTIVE_PROPERTY_DATA, { activePropertyData, data })
    dispatch('refreshCode')
  },
  async setActiveArea({ commit, getters, dispatch }, area) {
    let { activeArea, activeAreaData } = getters
    if (activeArea === area) return
    // save current area unless it is main area
    if (
      activeArea &&
      activeAreaData &&
      activeArea !== LayoutHelper.Const.MAIN_AREA &&
      !activeAreaData.saved
    ) {
      await dispatch('saveSiteConfigPage', activeAreaData)
    }
    commit(SET_ACTIVE_AREA, area)
    commit(SET_ACTIVE_MOD, null)
    commit(SET_ACTIVE_PROPERTY, null)
    commit(UPDATE_MANAGE_PANE_COMPONENT, 'ModsList')
    await dispatch('refreshCode')
  },
  async saveSiteConfigPage({ commit, getters, dispatch }, { content, path }) {
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
    if (key === state.activePage.activeMod.key) {
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

  undo({ getters, dispatch }) {
    UndoHelper.undo(
      getters.activeAreaData.undoManager,
      (code = '', cursor = { line: 1, ch: 0 }) => {
        dispatch('updateMarkDown', { code, historyDisabled: true })
        dispatch('updateCursor', { cursor })
      }
    )
  },
  redo({ getters, dispatch }) {
    UndoHelper.redo(
      getters.activeAreaData.undoManager,
      (code = '', cursor = { line: 1, ch: 0 }) => {
        dispatch('updateMarkDown', { code, historyDisabled: true })
        dispatch('updateCursor', { cursor })
      }
    )
  },
  setNewModPosition({ commit }, position) {
    commit(SET_NEW_MOD_POSITION, position)
  },
  async refreshSiteSettings(
    { commit, dispatch, getters, rootGetters },
    { sitePath }
  ) {
    let siteSetting = initSiteState()
    await dispatch('user/getSiteLayoutConfig', { path: sitePath })
    let {
      'user/siteLayoutConfigBySitePath': siteLayoutConfigBySitePath,
      'user/allLayoutContentFilePathsBySitePath': allLayoutContentFilePathsBySitePath,
      'gitlab/getFileByPath': gitlabGetFileByPath
    } = rootGetters
    siteSetting.siteLayoutConfig = siteLayoutConfigBySitePath(sitePath)
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
          fileName: fileName
        })
      })
    )

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

  async refreshOpenedFile(
    { commit, dispatch, rootGetters, getters },
    { path, editorMode = true }
  ) {
    await dispatch('gitlab/readFile', { path, editorMode }, { root: true })
    let {
      'gitlab/getFileByPath': gitlabGetFileByPath,
      'user/username': username
    } = rootGetters
    let file = gitlabGetFileByPath(path)
    if (!file) return

    let { content } = file

    let pageData = initPageState()
    pageData.modList = Parser.buildBlockList(content)

    let fullPath = getFileFullPathByPath(path)
    let timestamp = Date.now()
    let commitPayload = {
      username,
      path: fullPath,
      data: { timestamp, path, content, ...pageData }
    }
    commit(RESET_OPENED_FILE, commitPayload)
    if (getFileFullPathByPath(getters.activePageUrl) === fullPath) {
      commit(SET_ACTIVE_PAGE, { path, username })
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
      partialUpdatedFileInfo: { timestamp, ...payload }
    }
    commit(UPDATE_OPENED_FILE, commitPayload)
  },
  closeOpenedFile(context, { path }) {
    let fullPath = getFileFullPathByPath(path)
    let {
      commit,
      state,
      rootGetters: { 'user/username': username }
    } = context
    commit(CLOSE_OPENED_FILE, { username, path: fullPath })

    if (path === state.activePageUrl) {
      commit(SET_ACTIVE_PAGE, null)
    }
  }
}

export default actions
